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
        SELECT *
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
    const data = await request.json()

    if (data.completed === undefined) {
      return NextResponse.json({ error: 'Missing field: completed' }, { status: 400 })
    }

    await sql/*sql*/`
      UPDATE todo
      SET completed = ${data.completed}
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
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

  } catch(err) {
    return NextResponse.json({err: String(err)});
  }
}