export const prerender = false;
import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { clients, items, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

const tables: any = {
  clients: clients,
  items: items,
  orders: orders,
};

// ОБРАБОТКА УДАЛЕНИЯ
export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    const { id } = await request.json();
    const entity = params.entity;

    if (!entity || !tables[entity]) {
      return new Response(JSON.stringify({ error: "Invalid entity" }), { status: 400 });
    }

    await db.delete(tables[entity]).where(eq(tables[entity].id, Number(id)));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
};

// ОБРАБОТКА СОЗДАНИЯ И ОБНОВЛЕНИЯ
export const POST: APIRoute = async ({ params, request }) => {
  try {
    const data = await request.json();
    const entity = params.entity;
    const table = tables[entity!];

    if (!table) return new Response(null, { status: 400 });

    if (data.id) {
      // Если есть ID — обновляем
      const { id, ...updateData } = data;
      await db.update(table).set(updateData).where(eq(table.id, Number(id)));
    } else {
      // Если ID нет — создаем новый
      await db.insert(table).values(data);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
};