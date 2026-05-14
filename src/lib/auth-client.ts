// src/lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
    // Обязательно укажи базовый URL твоего сайта
    baseURL: import.meta.env.BETTER_AUTH_URL 
});