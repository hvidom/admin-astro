// src/components/react/TableSection.tsx (or inside AdminDashboard.tsx)
import React from "react";
import { Trash2, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableSectionProps {
  title: string;
  items: any[];
  columns: string[];
  renderRow: (item: any) => React.ReactNode;
  onDelete: (id: number) => void;
  onEdit?: (item: any) => void;
  onAdd?: () => void;
}

export function TableSection({ 
  title, 
  items, 
  columns, 
  renderRow, 
  onDelete, 
  onEdit, 
  onAdd 
}: TableSectionProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200">
      <CardHeader className="flex flex-row items-center justify-between border-b bg-white rounded-t-xl p-4">
        <CardTitle className="text-lg font-bold text-slate-800">{title}</CardTitle>
        {onAdd && (
          <Button size="sm" onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
            Добавить +
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/70">
              <TableHead className="w-24 text-center">Действия</TableHead>
              {columns.map((col) => (
                <TableHead key={col} className="font-semibold text-slate-600">{col}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="flex justify-center gap-1 py-3">
                  {onEdit && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg" 
                      onClick={() => onEdit(item)}
                    >
                      <Edit3 size={14}/>
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg" 
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 size={14}/>
                  </Button>
                </TableCell>
                {renderRow(item)}
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-sm text-slate-400">
                  Нет данных для отображения
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}