export const prerender = false; 
import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { orders, clients } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export const GET: APIRoute = async () => {
  try {
    // 1. Считаем общую выручку
    const allOrders = await db.select().from(orders);
    const totalRevenue = allOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.amount, 0);

    // 2. Количество активных клиентов
    const allClients = await db.select().from(clients);
    const activeClientsCount = allClients.filter((c) => c.status === "active").length;

    // 3. Последние транзакции с левым соединением (получаем имя клиента)
    // Для простоты выгрузим последние 5 заказов и сопоставим в памяти или через связи:
    const recentOrdersRaw = await db
    .select({
      id: orders.id,
      amount: orders.amount,
      status: orders.status,
      createdAt: orders.createdAt,
      clientName: clients.name,
      clientEmail: clients.email,
    })
    .from(orders)
    // Исправленная строка: явно указываем связь через eq(таблица.поле, таблица.поле)
    .innerJoin(clients, eq(orders.clientId, clients.id)) 
    .orderBy(desc(orders.createdAt))
    .limit(5);

    // Подготовка фиктивных или реальных данных для недельного графика (как в dashboard-01)
    const chartData = [
      { name: "Янв", total: Math.floor(totalRevenue * 0.1) },
      { name: "Фев", total: Math.floor(totalRevenue * 0.15) },
      { name: "Мар", total: Math.floor(totalRevenue * 0.2) },
      { name: "Апр", total: Math.floor(totalRevenue * 0.25) },
      { name: "Май", total: totalRevenue },
    ];

    return new Response(
      JSON.stringify({
        totalRevenue,
        ordersCount: allOrders.length,
        activeClientsCount,
        recentOrders: recentOrdersRaw,
        chartData,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
};