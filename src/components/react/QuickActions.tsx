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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, endpoint: string) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Подготовка данных для отправки
    let payload: any = { ...rawData };

    // Исправление ошибки NaN: если создаем заказ, подтягиваем цену из пропсов items
    if (endpoint === "create-order") {
      const selectedItem = items.find((i) => i.id === Number(rawData.itemId));
      payload.amount = selectedItem ? Number(selectedItem.price) : 0;
      payload.clientId = Number(rawData.clientId);
      payload.itemId = Number(rawData.itemId);
    }

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ text: "✅ Done! The page will refresh...", isError: false });
        setTimeout(() => window.location.reload(), 800);
        } else {
        setMessage({ text: `❌ Error: ${result.error || "The server rejected the request"}`, isError: true });
      }
    } catch (err) {
      setMessage({ text: "❌ Ошибка сети", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Control Panel</h2>
        {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />}
      </div>
      
      {/* Кнопки выбора формы */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setActiveForm(activeForm === "client" ? null : "client")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeForm === "client" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          <UserPlus className="w-4 h-4 inline mr-2" /> Client
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "item" ? null : "item")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeForm === "item" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          <FolderPlus className="w-4 h-4 inline mr-2" /> Product
        </button>

        <button
          onClick={() => setActiveForm(activeForm === "order" ? null : "order")}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeForm === "order" ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
        >
          <ShoppingBag className="w-4 h-4 inline mr-2" /> Place an order
        </button>
      </div>

      {/* Уведомления */}
      {message && (
        <div className={`p-3 rounded-xl text-sm font-semibold animate-in fade-in zoom-in-95 ${message.isError ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
          {message.text}
        </div>
      )}

      {/* Форма Клиента */}
      {activeForm === "client" && (
        <form onSubmit={(e) => handleSubmit(e, "create-client")} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
          <input type="text" name="name" placeholder="Имя клиента" required className="bg-white border rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="email" name="email" placeholder="Email" required className="bg-white border rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="text" name="phone" placeholder="Телефон" className="bg-white border rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <button type="submit" disabled={loading} className="bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all">Создать</button>
        </form>
      )}

      {/* Форма Товара */}
      {activeForm === "item" && (
        <form onSubmit={(e) => handleSubmit(e, "create-item")} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
          <input type="text" name="name" placeholder="Название" required className="bg-white border rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <input type="number" step="0.01" name="price" placeholder="Цена ($)" required className="bg-white border rounded-lg p-2 text-sm focus:ring-2 ring-indigo-500 outline-none" />
          <select name="type" className="bg-white border rounded-lg p-2 text-sm outline-none">
          <option value="product">Product</option> 
          <option value="service">Service</option>
          </select>
          <button type="submit" disabled={loading} className="bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all">Добавить</button>
        </form>
      )}

      {/* Форма Заказа */}
      {activeForm === "order" && (
        <form onSubmit={(e) => handleSubmit(e, "create-order")} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-indigo-500 uppercase ml-1 tracking-widest">Кто покупает</label>
            <select name="clientId" required className="bg-white border rounded-lg p-2 text-sm outline-none">
              <option value="">Choose...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-indigo-500 uppercase ml-1 tracking-widest">Что покупает</label>
            <select name="itemId" required className="bg-white border rounded-lg p-2 text-sm outline-none">
              <option value="">Choose...</option>
              {items.map(i => <option key={i.id} value={i.id}>{i.name} (${i.price})</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              {loading ? "Recording..." : "Confirm order"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}