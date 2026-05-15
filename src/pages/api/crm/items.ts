export const prerender = false;
import type { APIRoute } from "astro";
import { db } from "@/lib/db";
import { items } from "@/db/schema";
import fs from "node:fs";
import path from "node:path";
import { eq } from "drizzle-orm";

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const id = formData.get("id") ? Number(formData.get("id")) : null;
    const name = formData.get("name") as string;
    const price = Number(formData.get("price"));
    const type = formData.get("type") as string;
    const imageFile = formData.get("image") as File | null;

    let imagePath: string | null = formData.get("currentImage") as string || null;

    // Если передан новый файл изображения
    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Генерируем уникальное имя файла
      const fileExt = path.extname(imageFile.name);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${fileExt}`;
      
      // Путь к папке public/images/ внутри проекта
      const uploadDir = path.join(process.cwd(), "public", "images");
      
      // Создаем папку, если её нет
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fullPath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullPath, buffer);

      // Путь, который запишем в БД и будем использовать на фронтенде
      imagePath = `/images/${fileName}`;
    }

    if (id) {
      // Обновление существующего товара
      await db.update(items)
        .set({ name, price, type, image: imagePath })
        .where(eq(items.id, id));
    } else {
      // Создание нового товара
      await db.insert(items).values({ name, price, type, image: imagePath });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
};


