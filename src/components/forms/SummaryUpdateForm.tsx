"use client";

import { useState } from "react";
import { updateSummaryAction, deleteSummaryAction } from "../../data/actions/summary-actions";

interface SummaryUpdateFormProps {
  item: {
    documentId: string;
    title: string;
    summary: string;
  };
}

export function SummaryUpdateForm({ item }: SummaryUpdateFormProps) {
  const [title, setTitle] = useState(item.title);
  const [summary, setSummary] = useState(item.summary);

  async function handleUpdate() {
    const result = await updateSummaryAction(item.documentId, { title, summary });
    if (result.success) {
      alert("Оновлено успішно!");
    } else {
      alert(result.error || "Помилка");
    }
  }

  async function handleDelete() {
    if (confirm("Ти впевнений, що хочеш видалити цей конспект?")) {
      await deleteSummaryAction(item.documentId);
    }
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div>
        <label className="block text-sm font-medium mb-1">Заголовок</label>
        <input 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Конспект</label>
        <textarea 
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={10}
          className="w-full p-2 border rounded text-black"
        />
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <button 
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Зберегти зміни
        </button>

        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 font-medium transition"
        >
          Видалити конспект
        </button>
      </div>
    </div>
  );
}