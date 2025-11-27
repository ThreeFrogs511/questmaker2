import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/server/connexion';


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const data = await request.json();
  const { column, xp } = data;

  const allowedColumns = ['xp', 'lvl', 'username'];
  if (!allowedColumns.includes(column)) {
    return NextResponse.json({ error: 'Invalid column' }, { status: 400 });
  }

  const query = `UPDATE users SET ${column} = $1 WHERE id = $2`;
  await sql.unsafe(query, [xp, id]); 

  return NextResponse.json({ success: true });
}