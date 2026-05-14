// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: {
            user: schema.users, // Better-Auth создаст свои таблицы, их нужно добавить в schema.ts
            session: schema.sessions,
            account: schema.accounts,
            verification: schema.verifications,
        }
    }),
    emailAndPassword: {
        enabled: true,
        async onCreateUser(user: { name: any; email: any; }) {
            // ЛОГИКА: Когда создается юзер в Auth, 
            // мы автоматически добавляем его в твою таблицу clients
            await db.insert(schema.clients).values({
                name: user.name,
                email: user.email,
                status: 'active'
            });
        }
    }
});