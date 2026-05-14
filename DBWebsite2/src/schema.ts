// src/schema.ts
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// Описываем структуру таблицы applications
export const applications = sqliteTable("applications", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    applicantName: text("applicantName"),
    email: text("email"),
    courseName: text("courseName"),
    level: text("level"),
    appliedAt: text("appliedAt")
});

// Экспортируем типы для использования в приложении (если понадобятся)
export type Application = InferSelectModel<typeof applications>;
export type NewApplication = InferInsertModel<typeof applications>;