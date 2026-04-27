"use client";

import { useState } from "react";
import { createSummaryAction } from "@/data/actions/summary-actions";

export function SummaryForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setLoading(true);
    setError(null);

    const videoUrl = formData.get("videoId") as string;

    // Викликаємо екшн для створення (Lab 6)
    const result = await createSummaryAction(videoUrl);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      alert("Конспект успішно створено!");
      setLoading(false);
      // Можна додати редирект на список
      window.location.href = "/dashboard/summaries";
    }
  }

  return (
    <form action={handleAction} className="space-y-4">
      <div>
        <label htmlFor="videoId" className="block text-sm font-medium mb-2">
          Посилання на YouTube
        </label>
        <input
          name="videoId"
          id="videoId"
          placeholder="https://youtu.be/..."
          required
          className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {loading ? "Обробка відео..." : "Згенерувати конспект"}
      </button>
    </form>
  );
}
