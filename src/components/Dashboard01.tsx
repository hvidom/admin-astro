import React, { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DashboardData {
  totalRevenue: number;
  ordersCount: number;
  activeClientsCount: number;
  recentOrders: Array<{
    id: number;
    amount: number;
    status: string;
    createdAt: string;
    clientName: string;
    clientEmail: string;
  }>;
  chartData: Array<{ name: string; total: number }>;
}

export default function Dashboard01() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Error loading dashboard data:", err));
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-sm text-slate-500 animate-pulse">Загрузка аналитики...</div>;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-50/50">
      {/* Шапка навигации */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </a>
          <a href="#" className="text-foreground transition-colors hover:text-foreground font-semibold">
            Дашборд
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Заказы
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Товары
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Клиенты
          </a>
          <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
            Партнеры
          </a>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 md:grow-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск по CRM..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Меню пользователя</span>
          </Button>
        </div>
      </header>

      {/* Основная сетка блоков Dashboard-01 */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {/* Карточки KPI */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общая Выручка</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+20.1% с прошлого месяца</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные Клиенты</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.activeClientsCount}</div>
              <p className="text-xs text-muted-foreground">+180.1% с прошлой недели</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Продажи</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{data.ordersCount}</div>
              <p className="text-xs text-muted-foreground">+19% с прошлого месяца</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активность систем</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 за последний час</p>
            </CardContent>
          </Card>
        </div>

        {/* Нижняя секция: Транзакции и Аналитика */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Транзакции</CardTitle>
                <CardDescription>Последние операции в вашей CRM-системе.</CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <a href="#">
                  Все заказы
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Клиент</TableHead>
                    <TableHead className="hidden xl:table-cell">Статус</TableHead>
                    <TableHead className="hidden h-9 w-12 sm:table-cell">Дата</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.clientName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {order.clientEmail}
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </TableCell>
                      <TableCell className="text-right font-medium">${order.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Виджет мини-аналитики / Тренды продаж */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение доходов</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="text-sm text-muted-foreground mb-2">Обзор темпов роста по отчетным периодам:</div>
              {data.chartData.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 font-medium text-sm">{item.name}</div>
                  <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-900 rounded-full transition-all" 
                      style={{ width: `${Math.min((item.total / (data.totalRevenue || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-semibold">${item.total}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}