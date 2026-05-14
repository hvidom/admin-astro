import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { orders, clients, items } from "@/db/schema";
export const prerender = false;
export const POST: APIRoute = async () => {
  try {
    const allClients = await db.select().from(clients);
    const allItems = await db.select().from(items);

    if (allClients.length === 0 || allItems.length === 0) {
      return new Response(JSON.stringify({ error: "Нет клиентов или товаров для связывания" }), { status: 400 });
    }

    // Выбираем случайных клиентов и товары из базы данных для симуляции сделки
    const randomClient = allClients[Math.floor(Math.random() * allClients.length)];
    const randomItem = allItems[Math.floor(Math.random() * allItems.length)];

    await db.insert(orders).values({
      clientId: randomClient.id,
      itemId: randomItem.id,
      amount: randomItem.price,
      status: "completed",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Ошибка транзакции" }), { status: 500 });
  }
};