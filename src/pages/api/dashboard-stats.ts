export const prerender = false;

import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { orders, clients, items, users } from "@/db/schema";
import { sql, desc } from "drizzle-orm";

export const GET: APIRoute = async () => {
  try {
    // 1. Общая выручка (сумма всех заказов)
    const revenueResult = await db
      .select({ value: sql<number>`sum(${orders.amount})` })
      .from(orders);
    const totalRevenue = revenueResult[0]?.value || 0;

    // 2. Количество заказов
    const ordersCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders);
    const ordersCount = ordersCountResult[0]?.count || 0;

    // 3. Количество клиентов (из таблицы клиентов CRM)
    const clientsCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(clients);
    const activeClientsCount = clientsCountResult[0]?.count || 0;

    // 4. Получение списков для таблиц
    const allClients = await db.query.clients.findMany({
      orderBy: [desc(clients.createdAt)],
    });

    const allItems = await db.query.items.findMany();

    const allUsers = await db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });

    const allOrdersFull = await db.query.orders.findMany({
      with: {
        client: true,
        item: true,
      },
      orderBy: [desc(orders.createdAt)],
    });

    // 5. Данные для мини-графика (выручка по дням за последние 7 дней)
    // Группируем по дате, отрезая время из строки datetime
    const chartDataRaw = await db
      .select({
        name: sql<string>`strftime('%d.%m', ${orders.createdAt})`,
        total: sql<number>`sum(${orders.amount})`,
      })
      .from(orders)
      .groupBy(sql`strftime('%Y-%m-%d', ${orders.createdAt})`)
      .orderBy(sql`strftime('%Y-%m-%d', ${orders.createdAt})`)
      .limit(7);

    // Собираем финальный JSON
    return new Response(
      JSON.stringify({
        totalRevenue,
        ordersCount,
        activeClientsCount,
        recentOrders: allOrdersFull.slice(0, 5).map((o) => ({
          id: o.id,
          amount: o.amount,
          status: o.status,
          createdAt: o.createdAt,
          clientName: o.client?.name || "Неизвестен",
          clientEmail: o.client?.email || "",
        })),
        tables: {
          orders: allOrdersFull,
          clients: allClients,
          items: allItems,
          users: allUsers,
        },
        chartData: chartDataRaw,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: String(error) }),
      { status: 500 }
    );
  }
};