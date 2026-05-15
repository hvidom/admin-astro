export const prerender = false; 

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { clients } from "@/db/schema";
export const POST: APIRoute = async ({ request }) => {
  const { name, email, phone } = await request.json();
  try {
    await db.insert(clients).values({ name, email, phone, status: "active" });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Creation error" }), { status: 500 });
  }
};