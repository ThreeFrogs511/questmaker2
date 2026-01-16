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


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {
    const { id } = await params
    const data = await request.json();
    const nbOfQuestsMax = 5;

    if (data.completed === undefined) return NextResponse.json({ error: 'Missing field: completed' })
    if (!data.taskUserId || !data.currentUser || !data.currentUser.id) return NextResponse.json({error: 'missing id'});
    if (data.taskUserId !== data.currentUser?.id) return NextResponse.json({error:"You are not authorized to use this action"});

    //fetching quest limit
    const questLimit = await sql`
    SELECT * FROM quest_rate_limit
    WHERE user_id = ${data.currentUser.id}
    `;


    // storing the current window_start value
    let windowStartMs;
    // storing the current count value
    let currentCount;

    // if no limit entry yet, we create it
    if (questLimit.length <=0) {
      const newLimit = await sql`
      INSERT INTO quest_rate_limit(user_id) VALUES (${data.currentUser.id})
      RETURNING user_id, window_start, count`

      if (newLimit.length <=0) return NextResponse.json({error: 'Failed to create new quest profile, please try again'});
      
      windowStartMs = new Date(newLimit[0].window_start).getTime();
      currentCount = 0;

    } else {
      windowStartMs = new Date(questLimit[0].window_start).getTime();
      currentCount = questLimit[0].count;
    }

    // collecting and calculating time window data
    const currentTimeMs = Date.now();
    // returns false or true
    const OneHourPassed = (currentTimeMs - windowStartMs) >= 3600000;

    // if the user has created 5 or more quests in a row and an hour hasn't passed yet, we block it
    if (currentCount >= nbOfQuestsMax && !OneHourPassed && data.completed === true) return NextResponse.json({limit: true});
  
    
    // then, we finally update the task
    const update = await sql`
      UPDATE todo
      SET completed = ${data.completed}
      WHERE id = ${id}
      RETURNING id;
    `
    if (update.length <=0) return NextResponse.json({error: "error during the update"});

  
    // if the user has created 5 or more quests in a row BUT one hour has passed, we update the count accordingly 
    if (currentCount>=nbOfQuestsMax && OneHourPassed && data.completed === true) {
      const resetLimit = await sql`
      UPDATE quest_rate_limit
      SET count = 1,
      window_start = NOW()
      WHERE user_id = ${data.currentUser.id}
      RETURNING count`
      if (resetLimit.length<=0) return NextResponse.json({error:"problem while updating data"});

    } else if (currentCount <nbOfQuestsMax && data.completed === true) {
      // we update quest_rate_limit and we add the new count and new window_start if the count is inferior to 5
      const newCount = currentCount +1;
      const updateLimit = await sql`
      UPDATE quest_rate_limit
      SET count = ${newCount},
      window_start = NOW()
      WHERE user_id = ${data.currentUser.id}
      RETURNING count`;
      if (updateLimit.length<=0) return NextResponse.json({error: "internal server error. Try later."});

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

    // then, updating coins value
    let updatedCoins = data.completed ? data.currentUser.coins + 1 : data.currentUser.coins - 1;
    updatedCoins = updatedCoins<0 ? 0 : updatedCoins;

    const res = await sql`
    UPDATE users
    SET coins = ${updatedCoins}
    WHERE id = ${data.currentUser.id}
    RETURNING coins;`

    if (res.length <=0) return NextResponse.json({error:"error during coins update"});

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