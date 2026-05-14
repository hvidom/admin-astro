// src/pages/api/auth/[...all].ts
export const prerender = false;
import { auth } from "@/lib/auth"; // твой основной конфиг
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (context) => {
  return auth.handler(context.request);
};