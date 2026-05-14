// src/db/schema.ts
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Существующая таблица контактов (из твоего шаблона)
export const contactSubmissions = sqliteTable("contact_submissions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  interest: text("interest"), // e.g. "volunteer", "partner", "fund", "general"
  status: text("status").notNull().default("new"), // new | read | replied
  ipAddress: text("ip_address"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// 2. Таблица клиентов (Clients)
export const clients = sqliteTable("clients", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(), // уникальный email для клиента
  phone: text("phone"),
  status: text("status").notNull().default("active"), // active | inactive
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// 3. Таблица заказов (Orders)
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }), // связь с клиентом + каскадное удаление
  product: text("product").notNull(),
  amount: real("amount").notNull(), // real используется в sqlite-core для дробных чисел (цены)
  status: text("status").notNull().default("pending"), // pending | processing | completed | cancelled
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});


// --- ТИПЫ ДЛЯ ИСПОЛЬЗОВАНИЯ В КОДЕ И В REACТ-КОМПОНЕНТАХ ---

// Типы для Contact Submissions
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

// Типы для Клиентов
export type Client = typeof clients.$inferSelect;
export type NewClient = typeof clients.$inferInsert;

// Типы для Заказов
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;