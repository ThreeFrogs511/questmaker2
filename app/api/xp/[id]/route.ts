import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/server/connexion';
import { checkAuth } from "@/lib/auth/checkAuth";


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await checkAuth();
  const { id } = await params;
  if (userId !== parseInt(id)) return NextResponse.json({ error: "Action not allowed" }, { status: 401 });
  const data = await request.json();
  const { column, xp } = data;

  const allowedColumns = ['xp', 'lvl', 'username'];
  if (!allowedColumns.includes(column)) {
    return NextResponse.json({ error: 'Invalid column' }, { status: 400 });
  }

  const query = `UPDATE characters SET ${column} = $1 WHERE user_id = $2`;
  await sql.unsafe(query, [xp, id]);

  return NextResponse.json({ success: true });
}