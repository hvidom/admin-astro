// src/pages/api/admin-logout.ts
export const prerender = false;
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Удаляем куку, устанавливая дату истечения в прошлом
  cookies.delete("admin_session", { path: "/" });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};