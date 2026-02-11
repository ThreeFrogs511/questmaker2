import { NextResponse } from 'next/server';
import { sql } from '@/server/connexion';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;
    if (!id) return NextResponse.json({error:"id null"});

    const todos = await sql`
        SELECT id, body, completed, user_id
        FROM todo
        WHERE user_id = ${id}
        ORDER BY id DESC
    `;

    if (todos.length === 0) return NextResponse.json({error:"No todos yet"});

    return NextResponse.json(todos);

  } catch (err) {
    return NextResponse.json({error: 'internal error'});
  }
}


// compléter ou annuler la complétion d'une quête
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params
    if (!id) return NextResponse.json({error:"id null"});

    const data = await request.json();

    // nombre de quêtes max qu'un utilisateur peut valider en 1 heure, évite les abus
    const nbOfQuestsMax = 5;

    //filtre de sécurité
    if (data.completed === undefined) return NextResponse.json({ error: 'Missing field: completed' })
    if (!data.taskUserId || !data.currentUser || !data.currentUser.id) return NextResponse.json({error: 'missing id'});

    //filtre d'intégrité, on vérifie que l'user est bien propriétaire de la quête qu'il souhaite valider
    if (data.taskUserId !== data.currentUser?.id) return NextResponse.json({error:"You are not authorized to use this action"});

    // On requête la table limitateur de quêtes
    //L'utilisateur n'a le droit de valider que 5 quêtes par heure, cette table garde un historique des complétions
    //et évite les abus
    const questLimit = await sql`
    SELECT * FROM quest_rate_limit
    WHERE user_id = ${data.currentUser.id}
    `;


    // variable qui stocke l'intervalle de temps qui détermine si l'user a le droit de compléter une quête ou non
    let windowStartMs;
    // variable qui stocke le nombre de quêtes validées durant l'intervalle de temps. Max = 5.
    let currentCount;

    // Si l'utilisateur valide sa première quête, on lui crée une entrée 
    //dans la table de limitateur de quêtes
    if (questLimit.length <=0) {
      const newLimit = await sql`
      INSERT INTO quest_rate_limit(user_id) VALUES (${data.currentUser.id})
      RETURNING user_id, window_start, count`

      if (newLimit.length <=0) return NextResponse.json({error: 'Failed to create new quest profile, please try again'});
      
      //par défaut, window_start débute à l'heure actuelle et count = 0.
      windowStartMs = new Date(newLimit[0].window_start).getTime();
      currentCount = 0;

    //sinon on récupère simplement les données existantes
    } else {
      windowStartMs = new Date(questLimit[0].window_start).getTime();
      currentCount = questLimit[0].count;
    }

    // On calcule l'heure actuelle. Puis on détermine via l'intervalle de temps si 
    // cela fait au moins 1h depuis la dernière complétion
    const currentTimeMs = Date.now();
    const OneHourPassed = (currentTimeMs - windowStartMs) >= 3600000;

    // Si l'user a complété 5 quêtes à la suite, en moins d'une heure, on refuse la nouvelle complétion et
    //on retourne une réponse
    if (currentCount >= nbOfQuestsMax && !OneHourPassed && data.completed === true) return NextResponse.json({limit: true});
  
    
    // Si la limite n'est pas atteinte, on autorise la complétion en mettant à jour la quête concernée
    const update = await sql`
      UPDATE todo
      SET completed = ${data.completed}
      WHERE id = ${id}
      RETURNING id;
    `
    if (update.length <=0) return NextResponse.json({error: "error during the update"});

  

    //On met à jour le limitateur. Ici si l'user a créé +5 quêtes mais que la limite de temps 
    //s'est écoulée, on reset le compteur et l'intervalle
    if (currentCount>=nbOfQuestsMax && OneHourPassed && data.completed === true) {
      const resetLimit = await sql`
      UPDATE quest_rate_limit
      SET count = 1,
      window_start = NOW()
      WHERE user_id = ${data.currentUser.id}
      RETURNING count`
      if (resetLimit.length<=0) return NextResponse.json({error:"problem while updating data"});


    //si l'user a créé <5 quêtes, on incrémente le compteur, et on insère l'heure de la dernière entrée 
    //comme début de l'intervalle
    } else if (currentCount <nbOfQuestsMax && data.completed === true) {
      const newCount = currentCount +1;
      const updateLimit = await sql`
      UPDATE quest_rate_limit
      SET count = ${newCount},
      window_start = NOW()
      WHERE user_id = ${data.currentUser.id}
      RETURNING count`;
      if (updateLimit.length<=0) return NextResponse.json({error: "internal server error. Try later."});


    //ici on gère l'annulation de quêtes. Si l'user veut revenir en arrière et "décompléter"
    //une quête. On décremente le compteur (minimum 0) et on reset l'intervalle par défaut
    } else if (data.completed === false) {
      const newCount = currentCount <= 0 ? 0 : currentCount - 1;
      const updateLimit = await sql`
      UPDATE quest_rate_limit
      SET count = ${newCount},
      window_start = NOW()
      WHERE user_id = ${data.currentUser.id}
      RETURNING count`;
      if (updateLimit.length<=0) return NextResponse.json({error: "internal server error. Try later."});
    }

    // Si tout est ok, on met à jour le portefeuille virtuel de l'user
    //Il gagne +1 s'il complète une quête, -1 s'il en annule une (pour reset)
    let updatedCoins = data.completed ? data.currentUser.coins + 1 : data.currentUser.coins - 1;
    updatedCoins = updatedCoins<0 ? 0 : updatedCoins; // la somme ne peut pas être négative

    const res = await sql`
    UPDATE users
    SET coins = ${updatedCoins}
    WHERE id = ${data.currentUser.id}
    RETURNING coins;`

    if (res.length <=0) return NextResponse.json({error:"error during coins update"});


    //Enfin, on retourne une réponse côté client avec la confirmation de succès de l'opération
    //et la valeur actualisée du portefeuille
    return NextResponse.json({ success: true, coins:res});

  } catch (err) {
    return NextResponse.json({error: String(err)});
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params
    if (id === undefined) throw new Error('Undefined user id');

    await sql/*sql*/`
      DELETE FROM todo
      WHERE id = ${id}`

    return NextResponse.json({ success: true });

  } catch(error) {
    return NextResponse.json({error: String(error)});
  }
}