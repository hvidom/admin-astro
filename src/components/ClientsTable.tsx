import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Client {
  id: number;
  name: string;
  email: string;
}

interface Props {
  initialClients: Client[];
}

export default function ClientsTable({ initialClients }: Props) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    // Отправляем запрос на наш Astro API
    const response = await fetch(`/api/clients/${editingClient.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingClient),
    });

    if (response.ok) {
      // Обновляем локальный стейт
      setClients(clients.map(c => c.id === editingClient.id ? editingClient : c));
      setEditingClient(null);
    } else {
      alert('Ошибка при сохранении');
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.id}</TableCell>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                      Редактировать
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать клиента #{client.id}</DialogTitle>
                    </DialogHeader>
                    {editingClient && (
                      <form onSubmit={handleSave} className="space-y-4 mt-4">
                        <div>
                          <label className="text-sm font-medium">Имя</label>
                          <Input 
                            value={editingClient.name} 
                            onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input 
                            type="email"
                            value={editingClient.email} 
                            onChange={e => setEditingClient({...editingClient, email: e.target.value})}
                          />
                        </div>
                        <Button type="submit" className="w-full">Сохранить</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}