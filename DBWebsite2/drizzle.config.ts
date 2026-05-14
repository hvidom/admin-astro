// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Указываем диалект СУБД
  dialect: "sqlite", 
  
  // Путь к файлу (или файлам), где описана схема таблиц
  schema: "./src/schema.ts",
  
  // Папка, куда drizzle-kit будет складывать сгенерированные SQL-миграции
  out: "./drizzle",
  
  // Настройки подключения к базе данных для инспекции и миграций
  dbCredentials: {
    // Drizzle Studio connects via @libsql/client; for local SQLite file use file: URL
    url: "file:data/college.db",
  },
});