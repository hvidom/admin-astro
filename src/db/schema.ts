// src/db/schema.ts
import { text, integer, real, sqliteTable } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";


export const users = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id),
});

export const accounts = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

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


export const partners = sqliteTable("partners", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull(), // e.g., "supplier", "distributor", "marketing"
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 3. Товары и Услуги
export const items = sqliteTable("items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  type: text("type").notNull(), // "product" | "service"
  stock: integer("stock").default(0), // Для физических товаров
  status: text("status").notNull().default("available"), // available | out_of_stock
  image: text("image"), // Сюда будем писать путь: "/images/file-name.jpg"
});

// 4. Заказы
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: integer("client_id")
    .notNull()
    .references(() => clients.id, { onDelete: "cascade" }),
  itemId: integer("item_id")
    .notNull()
    .references(() => items.id),
  amount: real("amount").notNull(), // Итоговая цена с учетом скидок/количества
  status: text("status").notNull().default("pending"), // pending | completed | cancelled
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

// 5. Таблица логов/аналитики (для отслеживания активности CRM)
export const analyticsLogs = sqliteTable("analytics_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  metricName: text("metric_name").notNull(), // e.g., "page_view", "user_signup", "sale"
  value: real("value").notNull(),
  metadata: text("metadata"), // Дополнительный JSON в виде строки
  timestamp: text("timestamp").notNull().default(sql`(datetime('now'))`),
});

export const ordersRelations = relations(orders, ({ one }) => ({
  client: one(clients, {
    fields: [orders.clientId],
    references: [clients.id],
  }),
  item: one(items, {
    fields: [orders.itemId],
    references: [items.id],
  }),
}));
// Экспорт типов для TypeScript & React компонентов
export type Partner = typeof partners.$inferSelect;
export type Item = typeof items.$inferSelect;
export type AnalyticsLog = typeof analyticsLogs.$inferSelect;

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