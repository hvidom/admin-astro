export const prerender = false; // Добавь это первой строкой

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { orders, items } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { clientId, itemId } = await request.json();

    // 1. Ищем товар в базе, чтобы получить актуальную цену
    const itemData = await db.select().from(items).where(eq(items.id, Number(itemId))).get();

    if (!itemData) {
      return new Response(JSON.stringify({ error: "Товар не найден" }), { status: 404 });
    }

    // 2. Вставляем заказ с реальной ценой
    await db.insert(orders).values({
      clientId: Number(clientId),
      itemId: Number(itemId),
      amount: Number(itemData.price), // Теперь здесь точно число, а не NaN
      status: "completed",
      createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Ошибка сервера" }), { status: 500 });
  }
};