import type { APIRoute } from 'astro';
import { db } from '@/lib/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  
  try {
    const body = await request.json();
    const { name, email, phone, status } = body;

    // Сохраняем измененные данные непосредственно в local.db
    await db
      .update(clients)
      .set({ name, email, phone, status })
      .where(eq(clients.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Ошибка при обновлении базы данных' }), { status: 500 });
  }
};