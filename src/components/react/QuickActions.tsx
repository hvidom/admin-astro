// src/components/QuickActions.tsx
import React, { useState } from "react";
import { UserPlus, ShoppingBag, FolderPlus, CreditCard } from "lucide-react";

interface Props {
  clients: any[];
  items: any[];
}

export default function QuickActions({ clients = [], items = [] }: Props) {
  const [activeForm, setActiveForm] = useState<"client" | "item" | "order" | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const payload = {
      clientId: Number(formData.get("clientId")),
      itemId: Number(formData.get("itemId")),
      // Мы берем цену товара из нашего списка items по id
      amount: items.find(i => i.id === Number(formData.get("itemId")))?.price || 0
    };

    try {
      const response = await fetch('/api/create-order', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setMessage("✅ Заказ успешно создан! Обновите страницу.");
        setActiveForm(null);
      }
    } catch (err) {
      setMessage("❌ Ошибка соединения.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
      <h2 className="text-lg font-semibold tracking-tight text-slate-800">Быстрые действия</h2>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveForm(activeForm === "client" ? null : "client")}
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          <UserPlus className="w-4 h-4" /> Новый клиент
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "order" ? null : "order")}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <CreditCard className="w-4 h-4" /> Создать заказ клиенту
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "item" ? null : "item")}
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
        >
          <FolderPlus className="w-4 h-4" /> Добавить товар
        </button>
      </div>

      {message && <p className="text-sm font-bold text-emerald-600 animate-pulse">{message}</p>}

      {/* ФОРМА СОЗДАНИЯ КОНКРЕТНОГО ЗАКАЗА */}
      {activeForm === "order" && (
        <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100 mt-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-blue-600 uppercase">Выберите клиента</label>
            <select name="clientId" required className="p-2 border rounded bg-white text-sm">
              <option value="">-- Выбрать из базы --</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-blue-600 uppercase">Выберите товар/услугу</label>
            <select name="itemId" required className="p-2 border rounded bg-white text-sm">
              <option value="">-- Выбрать товар --</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name} (${i.price})</option>)}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-600 text-white py-2 rounded text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Запись..." : "Подтвердить покупку"}
            </button>
          </div>
        </form>
      )}

      {/* (Остальные формы client и item остаются без изменений из предыдущего ответа) */}
    </div>
  );
}