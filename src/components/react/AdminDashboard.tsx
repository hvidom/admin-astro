// src/components/react/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users2, 
  ShieldCheck, LogOut, Package2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TableSection } from "./TableSection"; // Imported from file above

type Tab = "dashboard" | "orders" | "items" | "clients" | "users";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const refreshData = () => {
    fetch("/api/dashboard-stats")
      .then(res => res.json())
      .then(d => setData(d))
      .catch(err => console.error("Error fetching stats:", err));
  };

  useEffect(() => { refreshData(); }, []);

  // Generic handler for JSON-based operations (clients, orders, etc.)
  const handleGenericAction = async (method: string, entity: string, payload: any) => {
    if (method === "DELETE" && !confirm("Are you sure you want to delete this record?")) return;
    
    const res = await fetch(`/api/crm/${entity}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) refreshData();
    else alert("An error occurred while performing the operation");
  };

  // Dedicated handler for Products/Services (handles image files)
  const handleItemSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingItem) {
      formData.append("id", editingItem.id);
      formData.append("currentImage", editingItem.image || "");
    }

    const res = await fetch("/api/crm/items", {
      method: "POST",
      body: formData, // browser automatically sets multipart/form-data headers
    });

    if (res.ok) {
      setIsItemModalOpen(false);
      setEditingItem(null);
      refreshData();
    } else {
      alert("Error saving item");
    }
  };

  if (!data) return <div className="p-8 text-center  animate-pulse font-medium">Loading CRM data...</div>;

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
      
      {/* SIDEBAR */}
      <aside className="hidden border-r  md:block">
        <div className="flex h-full flex-col">
          <div className="h-14 flex items-center px-6 border-b font-black text-indigo-600 gap-2 tracking-wider">
            <Package2 className="h-5 w-5" /> <span>ASTRO CRM</span>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <NavBtn active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <NavBtn active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<ShoppingCart size={18}/>} label="Orders" />
            <NavBtn active={activeTab === "items"} onClick={() => setActiveTab("items")} icon={<Package size={18}/>} label="Products" />
            <NavBtn active={activeTab === "clients"} onClick={() => setActiveTab("clients")} icon={<Users2 size={18}/>} label="Clients" />
            <NavBtn active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<ShieldCheck size={18}/>} label="System" />
          </nav>
        </div>
      </aside>

      {/* MAIN SYSTEM CONTAINER */}
      <div className="flex flex-col ">
        <header className="h-14 border-b  flex items-center px-6 justify-between sticky top-0 z-10 backdrop-blur-md">
          <h2 className="font-bold  uppercase tracking-wider text-xs">{activeTab}</h2>
          <Button variant="ghost" onClick={() => window.location.href='/admin/login'} className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl">
            <LogOut size={18} className="mr-2"/> Log Out
          </Button>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === "dashboard" && <DashboardOverview data={data} />}
          
          {/* CLIENTS TAB */}
          {activeTab === "clients" && (
            <TableSection
              title="Client Database"
              items={data.tables.clients}
              columns={["Name", "Email", "Phone"]}
              onAdd={() => {
                const name = prompt("Client Name:");
                const email = prompt("Email:");
                if(name && email) handleGenericAction("POST", "clients", { name, email });
              }}
              onEdit={(client: any) => {
                const name = prompt("Edit Name:", client.name);
                const email = prompt("Change Email:", client.email);
                if(name && email) handleGenericAction("POST", "clients", { ...client, name, email });
              }} 
              onDelete={(id) => handleGenericAction("DELETE", "clients", { id })} 
              renderRow={(c: any) => ( 
                <> 
                  <TableCell className="font-bold ">{c.name}</TableCell> 
                  <TableCell className="">{c.email}</TableCell> 
                  <TableCell className="">{c.phone || "—"}</TableCell> 
                </> 
              )} 
            /> 
          )}

          {/* ITEMS TAB (WITH FILE UPLOAD INTEGRATION) */}
          {activeTab === "items" && (
            <div className="space-y-4">
              <TableSection
                title="Product and Services Catalog"
                items={data.tables.items}
                columns={["Preview", "Name", "Price", "Type"]}
                onAdd={() => { setEditingItem(null); setIsItemModalOpen(true); }}
                onEdit={(item: any) => { setEditingItem(item); setIsItemModalOpen(true); }}
                onDelete={(id) => handleGenericAction("DELETE", "items", { id })}
                renderRow={(i: any) => (
                  <>
                    <TableCell>
                      {i.image ? (
                        <img src={i.image} alt={i.name} className="w-10 h-10 object-cover rounded-xl border border-slate-200/60 shadow-inner " />
                      ) : (
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 text-sm border border-dashed">📦</div>
                      )}
                    </TableCell>
                    <TableCell className="font-bold ">{i.name}</TableCell>
                    <TableCell className="font-semibold ">${i.price}</TableCell>
                    <TableCell>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${i.type === 'product' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-purple-50 text-purple-700 border border-purple-100'}`}>
                        {i.type === 'product' ? 'Product' : 'Service'}
                      </span>
                    </TableCell>
                  </>
                )}
              />

              {/* PRODUCT MODAL OVERLAY */}
              {isItemModalOpen && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                  <Card className="w-full max-w-md p-6 shadow-2xl rounded-2xl border-none">
                    <CardTitle className="text-xl font-black text-slate-900 mb-4">
                      {editingItem ? "Edit Item" : "Create New Item"}
                    </CardTitle>
                    <form onSubmit={handleItemSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold  block mb-1 uppercase tracking-wider">Title / Name</label>
                        <Input name="name" defaultValue={editingItem?.name || ""} required className="rounded-xl border-slate-200 focus-visible:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold  block mb-1 uppercase tracking-wider">Price ($)</label>
                        <Input name="price" type="number" defaultValue={editingItem?.price || ""} required className="rounded-xl border-slate-200 focus-visible:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1 uppercase tracking-wider">Type</label>
                        <select name="type" defaultValue={editingItem?.type || "product"} className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
                          <option value="product">Product</option>
                          <option value="service">Service</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold  block mb-1 uppercase tracking-wider">Image Attachment</label>
                        <Input name="image" type="file" accept="image/*" className="rounded-xl border-slate-200 file:bg-slate-100 file:border-0 file:rounded-lg file:text-xs file:font-bold cursor-pointer" />
                        {editingItem?.image && (
                          <p className="text-[10px]  mt-1 truncate">Current file: {editingItem.image}</p>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
                        <Button type="button" variant="ghost" className="rounded-xl" onClick={() => { setIsItemModalOpen(false); setEditingItem(null); }}>Cancel</Button>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6">Save</Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <TableSection 
              title="Incoming Orders" 
              items={data.tables.orders} 
              columns={["ID", "Client", "Amount", "Status"]}
              onDelete={(id) => handleGenericAction("DELETE", "orders", { id })}
              renderRow={(o: any) => (
                <>
                  <TableCell className="font-mono text-xs text-slate-400">#{o.id}</TableCell>
                  <TableCell className="font-medium text-slate-900">{o.client?.name || "Guest"}</TableCell>
                  <TableCell className="font-bold text-indigo-600">${o.amount}</TableCell>
                  <TableCell>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                      {o.status === 'completed' ? 'Paid' : 'Pending'}
                    </span>
                  </TableCell>
                </>
              )}
            />
          )}

          {/* USER SYSTEM PRIVILEGES */}
          {activeTab === "users" && (
            <TableSection 
              title="Better-Auth Users" 
              items={data.tables.users} 
              columns={["Session ID", "Account Name", "Email", "Email Verified"]}
              onDelete={(id) => handleGenericAction("DELETE", "users", { id })}
              renderRow={(u: any) => (
                <>
                  <TableCell className="font-mono text-[10px] text-slate-400">{u.id.substring(0, 12)}...</TableCell>
                  <TableCell className="font-bold text-slate-900">{u.name}</TableCell>
                  <TableCell className="text-slate-600">{u.email}</TableCell>
                  <TableCell className="text-center text-sm">{u.emailVerified ? "✅" : "❌"}</TableCell>
                </>
              )}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Internal Navigation Helper Button
function NavBtn({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl transition-all font-semibold text-sm ${
        active 
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
          : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
      }`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

// Simple KPI Analytics view for Dashboard Overview Tab
function DashboardOverview({ data }: { data: any }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6  ring-1 ring-slate-200 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold  uppercase tracking-widest">Total Revenue</span>
          <p className="text-3xl font-black text-indigo-600 mt-1">${data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="p-6  ring-1 ring-slate-200 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold  uppercase tracking-widest">Total Orders</span>
          <p className="text-3xl font-black mt-1">{data.ordersCount}</p>
        </div>
        <div className="p-6  ring-1 ring-slate-200 rounded-2xl shadow-sm sm:col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold  uppercase tracking-widest">Registered Clients</span>
          <p className="text-3xl font-black  mt-1">{data.activeClientsCount}</p>
        </div>
      </div>

      <Card className="p-6 border-none ring-1 ring-slate-200 shadow-sm rounded-2xl">
        <h3 className="font-boldtext-base mb-4">Recent Activity Log</h3>
        <div className="divide-y divide-slate-100">
          {data.recentOrders.map((o: any) => (
            <div key={o.id} className="flex justify-between items-center py-3 text-sm first:pt-0 last:pb-0">
              <div className="flex flex-col">
                <span className="font-bold ">{o.clientName}</span>
                <span className="text-xs ">{o.clientEmail}</span>
              </div>
              <span className="font-mono font-bold ">${o.amount}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}