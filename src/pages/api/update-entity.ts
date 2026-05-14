export const prerender = false; 

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { clients, items, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { table, id, data } = await request.json();

    let targetTable;
    if (table === "clients") targetTable = clients;
    else if (table === "items") targetTable = items;
    else if (table === "orders") targetTable = orders;
    else throw new Error("Unknown table");

    await db.update(targetTable)
      .set(data)
      .where(eq(targetTable.id, id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
  }
};