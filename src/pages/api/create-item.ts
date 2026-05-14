export const prerender = false; 

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
export const POST: APIRoute = async ({ request }) => {
  const { name, price, type } = await request.json();
  try {
    await db.insert(items).values({ name, price, type, stock: 10, status: "available" });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Ошибка создания" }), { status: 500 });
  }
};