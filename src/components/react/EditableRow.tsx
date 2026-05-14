import React, { useState } from "react";
import { Check, X, Pencil, Loader2 } from "lucide-react";

interface Field {
  key: string;
  label: string;
  type: string;
}

interface Props {
  item: any;
  fields: Field[];
  tableName: string;
  renderStatic: (item: any) => React.ReactNode;
}

export default function EditableRow({ item, fields, tableName, renderStatic }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(item);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/update-entity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: tableName,
          id: item.id,
          data: formData,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        // Обновляем страницу, чтобы SSR подтянул новые данные из БД
        window.location.reload();
      } else {
        alert("Ошибка при сохранении");
      }
    } catch (err) {
      console.error(err);
      alert("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(item);
    setIsEditing(false);
  };

  // Режим чтения (Обычная строка таблицы)
  if (!isEditing) {
    return (
      <tr className="hover:bg-slate-50/80 transition-colors group">
        {renderStatic(item)}
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Редактировать"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  }

  // Режим редактирования (Инпуты)
  return (
    <tr className="bg-indigo-50/30 animate-in fade-in duration-300">
      {fields.map((field) => (
        <td key={field.key} className="px-6 py-3">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-tighter">
              {field.label}
            </label>
            <input
              type={field.type}
              value={formData[field.key] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field.key]: e.target.value })
              }
              className="w-full p-1.5 text-sm border border-indigo-200 rounded-md bg-white focus:ring-2 ring-indigo-500 outline-none shadow-sm"
              disabled={loading}
            />
          </div>
        </td>
      ))}
      <td className="px-6 py-3 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors disabled:opacity-50"
            title="Сохранить"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"
            title="Отмена"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}