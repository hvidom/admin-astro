// src/db/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/db/schema";
import path from "node:path";

// Формируем абсолютный путь к файлу local.db внутри папки src/db/
const dbPath = path.resolve(process.cwd(), "src/db/local.db");

// Инициализируем клиент LibSQL, указывая локальный файл
const client = createClient({
  url: `file:${dbPath}`,
});

// Экспортируем настроенный экземпляр Drizzle с поддержкой нашей схемы и типов
export const db = drizzle(client, { schema });