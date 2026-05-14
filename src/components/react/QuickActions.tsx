import React, { useState } from "react";
import { UserPlus, ShoppingBag, FolderPlus, CreditCard, Loader2 } from "lucide-react";

interface Props {
  clients: any[];
  items: any[];
}

export default function QuickActions({ clients = [], items = [] }: Props) {
  const [activeForm, setActiveForm] = useState<"client" | "item" | "order" | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Универсальный обработчик для всех API вызовов
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, endpoint: string) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ text: "✅ Данные успешно сохранены! Обновляем...", isError: false });
        setTimeout(() => window.location.reload(), 1000); // Перезагрузка для SSR данных
      } else {
        const errorData = await response.json();
        setMessage({ text: `❌ Ошибка: ${errorData.error || "Не удалось сохранить"}`, isError: true });
      }
    } catch (err) {
      setMessage({ text: "❌ Сетевая ошибка. Проверьте соединение.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Быстрые операции</h2>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveForm(activeForm === "client" ? null : "client")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeForm === "client" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <UserPlus className="w-4 h-4" /> Новый клиент
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "item" ? null : "item")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeForm === "item" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FolderPlus className="w-4 h-4" /> Добавить товар
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "order" ? null : "order")}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeForm === "order" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <CreditCard className="w-4 h-4" /> Оформить заказ
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.isError ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
          {message.text}
        </div>
      )}

      {/* Форма: Новый клиент */}
      {activeForm === "client" && (
        <form onSubmit={(e) => handleSubmit(e, "create-client")} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
          <input type="text" name="name" placeholder="ФИО" required className="p-2.5 border rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="email" name="email" placeholder="Email" required className="p-2.5 border rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="text" name="phone" placeholder="Телефон" className="p-2.5 border rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <button type="submit" disabled={loading} className="bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50">
            Создать
          </button>
        </form>
      )}

      {/* Форма: Добавить товар */}
      {activeForm === "item" && (
        <form onSubmit={(e) => handleSubmit(e, "create-item")} className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
          <input type="text" name="name" placeholder="Название товара" required className="p-2.5 border rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="number" step="0.01" name="price" placeholder="Цена ($)" required className="p-2.5 border rounded-xl text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <select name="type" className="p-2.5 border rounded-xl text-sm bg-white outline-none focus:ring-2 ring-indigo-500">
            <option value="product">Товар</option>
            <option value="service">Услуга</option>
          </select>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50">
            Добавить
          </button>
        </form>
      )}

      {/* Форма: Оформить заказ */}
      {activeForm === "order" && (
        <form onSubmit={(e) => handleSubmit(e, "create-order")} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">Клиент</label>
            <select name="clientId" required className="w-full p-2.5 border rounded-xl text-sm bg-white outline-none">
              <option value="">-- Выбрать клиента --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-indigo-400 ml-1">Товар</label>
            <select name="itemId" required className="w-full p-2.5 border rounded-xl text-sm bg-white outline-none">
              <option value="">-- Выбрать товар --</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name} (${i.price})</option>)}
            </select>
          </div>
          <div className="flex items-end pb-0.5">
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 disabled:opacity-50">
              Оформить сделку
            </button>
          </div>
        </form>
      )}
    </div>
  );
}