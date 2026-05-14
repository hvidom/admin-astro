// src/db/seed.ts
import { db } from "@/lib/db";
import { clients, partners, items, orders } from "./schema";

async function main() {
  console.log("⏳ Начинаем заполнение базы данных демо-данными...");

  // 1. Очищаем старые данные (строго в правильном порядке из-за Foreign Keys)
  await db.delete(orders);
  await db.delete(clients);
  await db.delete(partners);
  await db.delete(items);
  
  console.log("🧹 Старые данные успешно удалены.");

  // 2. Создаем демо-клиентов по одному, чтобы гарантировать запись в файл
  console.log("👥 Создаем клиентов...");
  await db.insert(clients).values({ name: "Александр Иванов", email: "alex.ivanov@mail.ru", phone: "+7 (911) 123-45-67", status: "active" });
  await db.insert(clients).values({ name: "Мария Смирнова", email: "masha.sm@yandex.ru", phone: "+7 (921) 987-65-43", status: "active" });
  await db.insert(clients).values({ name: "Дмитрий Петров", email: "dima.petrov@gmail.com", phone: "+7 (905) 555-33-22", status: "active" });
  await db.insert(clients).values({ name: "Елена Кузнецова", email: "elena.kuz@outlook.com", phone: "+7 (999) 111-22-33", status: "inactive" });
  await db.insert(clients).values({ name: "Ольга Новикова", email: "olga.nav@tech.co", phone: "+7 (916) 444-55-66", status: "active" });

  // Теперь они железно в базе. Вытягиваем их:
  const allClients = await db.select().from(clients);
  console.log(`✅ Клиенты созданы. Всего в базе: ${allClients.length}`);

  // 3. Создаем демо-партнеров
  console.log("🤝 Создаем партнеров...");
  await db.insert(partners).values([
    { companyName: "Логистик Экспресс", contactName: "Игорь Крупнов", email: "coop@log-express.ru", type: "distributor" },
    { companyName: "Глобал Трейд Лимитед", contactName: "Джон Доу", email: "import@globaltrade.com", type: "supplier" },
    { companyName: "ЛидГен Маркетинг", contactName: "Анна Попова", email: "info@leadgen-agency.ru", type: "marketing" },
  ]);

  // 4. Создаем товары и услуги по одному
  console.log("📦 Создаем товары и услуги...");
  await db.insert(items).values({ name: "Ноутбук Pro Квант 15", description: "Мощный рабочий ноутбук, 16GB RAM, 512GB SSD", price: 1200.00, type: "product", stock: 15, status: "available" });
  await db.insert(items).values({ name: "Смартфон Вектор X", description: "Флагманский телефон с отличной камерой", price: 799.99, type: "product", stock: 42, status: "available" });
  await db.insert(items).values({ name: "Аудит IT-инфраструктуры", description: "Полный анализ серверов и сетевой безопасности компании", price: 450.00, type: "service", stock: 0, status: "available" });
  await db.insert(items).values({ name: "Подписка на Облако (1 год)", description: "Корпоративный доступ к облачному хранилищу", price: 120.00, type: "service", stock: 0, status: "available" });

  // Вытягиваем товары:
  const allItems = await db.select().from(items);
  console.log(`✅ Товары созданы. Всего в базе: ${allItems.length}`);

  // 5. Оформляем демо-заказы
  console.log("🛒 Оформляем демо-заказы...");
  
  // ИСПРАВЛЕНО: Добавлены квадратные скобки [индекс] для получения конкретного объекта
  const clientA = allClients;
  const clientB = allClients;
  const clientC = allClients;
  const clientE = allClients;

  const itemNotebook = allItems;
  const itemPhone = allItems;
  const itemAudit = allItems;
  const itemCloud = allItems;

  // Вставляем заказы поштучно, чтобы SQLite гарантированно подхватил внешние ключи
  await db.insert(orders).values({
    clientId: clientA.id,
    itemId: itemNotebook.id,
    amount: 1200.00,
    status: "completed",
    createdAt: "2026-01-15 10:30:00",
  });

  await db.insert(orders).values({
    clientId: clientB.id,
    itemId: itemPhone.id,
    amount: 799.99,
    status: "completed",
    createdAt: "2026-02-20 14:22:11",
  });

  await db.insert(orders).values({
    clientId: clientC.id,
    itemId: itemAudit.id,
    amount: 450.00,
    status: "completed",
    createdAt: "2026-03-05 09:15:00",
  });

  await db.insert(orders).values({
    clientId: clientE.id,
    itemId: itemCloud.id,
    amount: 120.00,
    status: "pending",
    createdAt: "2026-05-14 16:40:00",
  });

  await db.insert(orders).values({
    clientId: clientA.id,
    itemId: itemPhone.id,
    amount: 799.99,
    status: "completed",
    createdAt: "2026-05-14 17:10:00",
  });

  console.log("✅ База данных успешно заполнена тестовыми CRM данными!");
}

main().catch((err) => {
  console.error("❌ Ошибка при сидинге базы данных:", err);
  process.exit(1);
});