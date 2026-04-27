import Link from "next/link";
import { SummaryForm } from "@/components/forms/SummaryForm";

export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] text-black p-4">
      <h1 className="text-3xl font-bold mb-4">Створити новий конспект</h1>
      <p className="mb-8 text-gray-600 text-center">
        Встав посилання на YouTube відео, щоб почати генерацію за допомогою AI.
      </p>
      
      {/* ТЕПЕР ТУТ БУДЕ РЕАЛЬНА ФОРМА */}
      <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-md border">
         <SummaryForm />
      </div>

      <Link href="/dashboard/summaries" className="mt-8 text-blue-500 hover:underline flex items-center gap-2">
        <span>←</span> Повернутися до моїх конспектів
      </Link>
    </div>
  );
}