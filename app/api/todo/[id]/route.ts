import { NextResponse } from "next/server";
import { sql } from "@/server/connexion";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "id null" });

    const todos = await sql`
        SELECT id, body, completed, user_id
        FROM todo
        WHERE user_id = ${id}
        ORDER BY id DESC`;

    if (todos.length === 0) return NextResponse.json({ error: "No todos yet" });

    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

// compléter ou annuler la complétion d'une quête
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "id null" });

    const data = await request.json();

    // nombre de quêtes max qu'un utilisateur peut valider en 1 heure, évite les abus
    const nbOfQuestsMax = 5;

    //filtres de sécurité
    if (data.completed === undefined)
      return NextResponse.json({ error: "Missing field: completed" });
    if (!data.taskUserId || !data.currentUser || !data.currentUser.id)
      return NextResponse.json({ error: "missing id" });

    //filtre d'intégrité, on vérifie que l'user est bien propriétaire de la quête
    // qu'il souhaite valider
    if (data.taskUserId !== data.currentUser?.id)
      return NextResponse.json({
        error: "You are not authorized to use this action",
      });

    const out = await sql.begin(async (tx) => {
      const q = tx as unknown as typeof sql;

      // On requête la table limiteur de quêtes
      const questLimit = await q`SELECT * FROM quest_rate_limit 
      WHERE user_id = ${data.currentUser.id}`;

      // variable qui stocke le temps écoulé depuis la dernière quête complétée
      let windowStartMs;
      // variable qui stocke le nombre de quêtes validées durant l'intervalle de temps.
      // Max = 5.
      let currentCount;

      
      if (questLimit.length <= 0) {
        //par défaut, window_start débute à l'heure actuelle et count = 0.
        windowStartMs = Date.now();
        currentCount = 0;

        //sinon on récupère simplement les données existantes
      } else {
        windowStartMs = new Date(questLimit[0].window_start).getTime();
        currentCount = questLimit[0].count;
      };

      // On calcule l'heure actuelle. Puis on détermine via l'intervalle de temps si
      // cela fait au moins 1h depuis la dernière complétion
      const currentTimeMs = Date.now();
      const OneHourPassed = currentTimeMs - windowStartMs >= 3600000;

      // Si l'user a complété 5 quêtes à la suite, en moins d'une heure,
      // on refuse la nouvelle complétion et on retourne une réponse
      if (
        currentCount >= nbOfQuestsMax &&
        !OneHourPassed &&
        data.completed === true
      )
        throw new Error("limit");

      // Si la limite n'est pas atteinte, on autorise la complétion
      const update = await q`UPDATE todo 
      SET completed = ${data.completed}
      WHERE id = ${id} 
      RETURNING id;`;

      if (update.length <= 0)
        throw new Error("Server error. Please try later.");

      //On met à jour le limiteur.

      
      let newCount;

      //si l'user veut ACCOMPLIR une quête
      if (data.completed === true) {
        //si l'user a créé +5 quêtes mais que la limite de temps s'est écoulée, on reset le compteur
        if (
          currentCount >= nbOfQuestsMax &&
          OneHourPassed &&
          data.completed === true
        ) {
          newCount = 1;
          //si l'user a créé <5 quêtes, on incrémente le compteur
        } else if (currentCount < nbOfQuestsMax && data.completed === true) {
          newCount = currentCount + 1;
        };

        //on met à jour le limiteur
        //on crée une entrée si l'utilisateur n'en a pas, sinon on la met à jour
        const l =
          await q`INSERT INTO quest_rate_limit(user_id, count, window_start) 
        VALUES (${data.currentUser.id}, ${newCount}, NOW())
        ON CONFLICT (user_id)
        DO UPDATE set count = EXCLUDED.count, window_start = EXCLUDED.window_start
        RETURNING user_id, window_start, count`;

        if (l.length <= 0) throw new Error("Server error. Please try later.");

        //ici on gère l'ANNULATION de quêtes. 
        // On décremente le compteur (minimum 0) et on reset l'intervalle par défaut
      } else if (data.completed === false) {
        newCount = currentCount <= 0 ? 0 : currentCount - 1;
        const updateLimit = await q`UPDATE quest_rate_limit
          SET count = ${newCount}
          WHERE user_id = ${data.currentUser.id}
          RETURNING count`;
        if (updateLimit.length <= 0) throw new Error("Server error. Please try later.");
      };

      // Si tout est ok, on met à jour le portefeuille virtuel de l'user
      //Il gagne +1 s'il complète une quête, -1 s'il en annule une.
      let updatedCoins = data.completed
        ? data.currentUser.coins + 1
        : data.currentUser.coins - 1;
      updatedCoins = updatedCoins < 0 ? 0 : updatedCoins; // la somme ne peut pas être négative

      const res = await q`UPDATE users
      SET coins = ${updatedCoins}
      WHERE id = ${data.currentUser.id}
      RETURNING coins;`;

      if (res.length <= 0) throw new Error("Server error. Please try later.");

      //Enfin, on retourne une réponse côté client avec la confirmation de succès de l'opération
      //et la valeur actualisée du portefeuille
      return res;
    });

    return NextResponse.json({ success: true, coins: out });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (id === undefined) throw new Error("Undefined user id");

    await sql`
      DELETE FROM todo
      WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
