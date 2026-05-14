// src/index.ts
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { like } from "drizzle-orm";
import { applications } from "./schema";

const app = new Hono();
const PORT = 3000;
const DBFILE = "data/college.db";

// 1. Инициализируем bun:sqlite
const sqlite = new Database(DBFILE);

// 2. Передаем его в Drizzle ORM
const db = drizzle(sqlite);
console.log("Drizzle ORM successfully connected to bun:sqlite (TypeScript)");

// Простой аналог миграции при старте
sqlite.run(`CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    applicantName TEXT,
    email TEXT,
    courseName TEXT,
    level TEXT,
    appliedAt TEXT
)`);

// -- Middleware ---
app.use("/*", serveStatic({ root: "./" }));

app.get("/", async (c) => {
    try {
        const file = Bun.file("./index.html");
        return c.html(await file.text());
    } catch (err) {
        return c.text("Index file not found", 404);
    }
});

app.get("/currentDateTime", (c) => {
    return c.html(`<h1>Current Date and Time</h1><p>${getCurrentDateTime()}</p>`);
});

app.get("/greeting/:firstName/:lastName", (c) => {
    // В Hono параметры автоматически типизируются как строки
    const firstName = c.req.param("firstName");
    const lastName = c.req.param("lastName");
    return c.html(`<h1>${firstName} ${lastName} has joined our course!</h1>
        <h2>We are glad to have you here ${firstName}.</h2>`);
});

// Регистрация заявки (INSERT)
app.post("/apply", async (c) => {
    // Явно указываем, какие поля мы ждем из формы/JSON body
    const reqBody = await c.req.parseBody<{
        applicantName?: string;
        applicantEmail?: string;
        selectedCourse?: string;
        courseLevel?: string;
    }>();
    
    const applicant = reqBody.applicantName || "Unknown";
    const email = reqBody.applicantEmail || "";
    const course = reqBody.selectedCourse || "";
    const courseLevel = reqBody.courseLevel || "";
    const appliedAt = getCurrentDateTime();

    try {
        // Drizzle проверяет типы объекта внутри .values()
        const inserted = db.insert(applications).values({
            applicantName: applicant,
            email: email,
            courseName: course,
            level: courseLevel,
            appliedAt: appliedAt
        }).returning({ id: applications.id }).get();

        console.log(`Application data inserted. New ID: ${inserted?.id ?? "unknown"}`);

        const ackMessage = `<h1>Thank you, ${applicant}!</h1>
            <p>Your application for the ${course} course has been received.</p>
            <p>We will contact you at ${email} with further details.</p>
            <p><a href="/">Go back to the home page</a></p>`;
            
        return c.html(ackMessage);
    } catch (err) {
        console.error("Error inserting data:", err);
        return c.text("Internal Server Error", 500);
    }
});

// Получение одного студента (SELECT + WHERE)
app.get("/api/student", (c) => {
    const email = c.req.query("email");

    try {
        if (!email) {
            // record будет автоматически типизирован как Application | undefined
            const record = db.select().from(applications).limit(1).get();
            return c.json(record || {});
        } else {
            const record = db.select()
                             .from(applications)
                             .where(like(applications.email, email))
                             .get();
            return c.json(record || { message: "No student found" });
        }
    } catch (err) {
        console.error("Error retrieving student data:", err);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

// Получение всех студентов (SELECT *)
app.get("/api/students", (c) => {
    try {
        // records автоматически становится массивом Application[]
        const records = db.select().from(applications).all();
        console.log(`Fetched ${records.length} student records.`);
        return c.json(records);
    } catch (err) {
        console.error("Error retrieving students data:", err);
        return c.json({ error: "Internal Server Error" }, 500);
    }
});

// Хелпер даты
function getCurrentDateTime(): string {
    const now = new Date();
    return (
        String(now.getFullYear()) + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0") + " " +
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0")
    );
}

// Экспорт для запуска через Bun
export default {
    port: PORT,
    fetch: app.fetch,
};