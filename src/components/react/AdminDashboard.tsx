import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users2, 
  ShieldCheck, Menu, CircleUser, LogOut, Package2, Trash2, Edit3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type Tab = "dashboard" | "orders" | "items" | "clients" | "users";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const refreshData = () => {
    fetch("/api/dashboard-stats")
      .then(res => res.json())
      .then(d => setData(d));
  };

  useEffect(() => { refreshData(); }, []);

  const handleAction = async (method: string, entity: string, payload: any) => {
    const res = await fetch(`/api/crm/${entity}`, {
      method: method,
      body: JSON.stringify(payload),
    });
    if (res.ok) refreshData();
    else alert("Ошибка при выполнении операции");
  };

  if (!data) return <div className="p-8 text-center animate-pulse">Загрузка CRM...</div>;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      {/* SIDEBAR */}
      <aside className="hidden border-r bg-white md:block">
        <div className="flex h-full flex-col">
          <div className="h-14 flex items-center px-6 border-b font-black text-indigo-600 gap-2">
            <Package2 /> <span>ASTRO CRM</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <NavBtn active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard size={18}/>} label="Дашборд" />
            <NavBtn active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<ShoppingCart size={18}/>} label="Заказы" />
            <NavBtn active={activeTab === "items"} onClick={() => setActiveTab("items")} icon={<Package size={18}/>} label="Товары" />
            <NavBtn active={activeTab === "clients"} onClick={() => setActiveTab("clients")} icon={<Users2 size={18}/>} label="Клиенты" />
            <NavBtn active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<ShieldCheck size={18}/>} label="Система" />
          </nav>
        </div>
      </aside>

      <div className="flex flex-col bg-slate-50/50">
        <header className="h-14 border-b bg-white flex items-center px-6 justify-between sticky top-0 z-10">
          <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{activeTab}</h2>
          <Button variant="ghost" onClick={() => window.location.href='/admin/login'} className="text-rose-500"><LogOut size={18}/></Button>
        </header>

        <main className="p-6">
          {activeTab === "dashboard" && <DashboardOverview data={data} />}
          
          {activeTab === "clients" && (
            <TableSection 
              title="Клиенты" 
              items={data.tables.clients} 
              columns={["Имя", "Email", "Телефон"]}
              onAdd={() => {
                const name = prompt("Имя:");
                const email = prompt("Email:");
                if(name && email) handleAction("POST", "clients", { name, email });
              }}
              onDelete={(id: any) => handleAction("DELETE", "clients", { id })}
              renderRow={(c: any) => (
                <>
                  <TableCell className="font-bold">{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone || "—"}</TableCell>
                </>
              )}
            />
          )}

          {activeTab === "items" && (
            <TableSection 
              title="Товары" 
              items={data.tables.items} 
              columns={["Название", "Цена", "Тип"]}
              onAdd={() => {
                const name = prompt("Название:");
                const price = prompt("Цена:");
                if(name) handleAction("POST", "items", { name, price: Number(price), type: "service" });
              }}
              onDelete={(id: any) => handleAction("DELETE", "items", { id })}
              renderRow={(i: any) => (
                <>
                  <TableCell className="font-bold">{i.name}</TableCell>
                  <TableCell>${i.price}</TableCell>
                  <TableCell className="text-xs uppercase text-slate-400">{i.type}</TableCell>
                </>
              )}
            />
          )}

          {activeTab === "orders" && (
            <TableSection 
              title="Заказы" 
              items={data.tables.orders} 
              columns={["ID", "Клиент", "Сумма", "Статус"]}
              onDelete={(id: any) => handleAction("DELETE", "orders", { id })}
              renderRow={(o: any) => (
                <>
                  <TableCell className="font-mono text-xs">#{o.id}</TableCell>
                  <TableCell>{o.client?.name}</TableCell>
                  <TableCell className="font-bold text-indigo-600">${o.amount}</TableCell>
                  <TableCell><span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full font-bold uppercase">{o.status}</span></TableCell>
                </>
              )}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Вспомогательные компоненты для чистоты кода
function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-100"}`}>
      {icon} <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

function TableSection({ title, items, columns, renderRow, onDelete, onAdd }: any) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-white rounded-t-xl">
        <CardTitle className="text-lg">{title}</CardTitle>
        {onAdd && <Button size="sm" onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700">Добавить</Button>}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader><TableRow>
            <TableHead className="w-20 text-center">Действия</TableHead>
            {columns.map((col: string) => <TableHead key={col}>{col}</TableHead>)}
          </TableRow></TableHeader>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="flex justify-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => onDelete(item.id)}><Trash2 size={14}/></Button>
                </TableCell>
                {renderRow(item)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function DashboardOverview({ data }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard title="Выручка" value={`$${data.totalRevenue}`} color="text-indigo-600" />
        <KpiCard title="Заказы" value={data.ordersCount} />
        <KpiCard title="Клиенты" value={data.activeClientsCount} />
      </div>
      <Card className="p-6 border-none ring-1 ring-slate-200">
        <CardTitle className="mb-4">Последние 5 заказов</CardTitle>
        {/* Здесь можно вставить упрощенную таблицу или список */}
        {data.recentOrders.map((o: any) => (
          <div key={o.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <span>{o.clientName}</span>
            <span className="font-bold">${o.amount}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function KpiCard({ title, value, color }: any) {
  return (
    <Card className="p-6 border-none ring-1 ring-slate-200 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
      <p className={`text-3xl font-black mt-1 ${color || "text-slate-900"}`}>{value}</p>
    </Card>
  );
}