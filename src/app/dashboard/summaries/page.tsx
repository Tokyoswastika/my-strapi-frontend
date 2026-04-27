import qs from "qs";
import { getSummaries } from "@/data/loaders";
import { Search } from "@/components/custom/Search";
import { Pagination } from "@/components/custom/Pagination";
import Link from "next/link";

export default async function SummariesRoute({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const { query, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const pageSize = 6; // Скільки карток на сторінці

  // Формуємо запит для Strapi через qs
  const queryString = qs.stringify({
    filters: {
      $or: [
        { title: { $containsi: query || "" } },
        { summary: { $containsi: query || "" } },
      ],
    },
    pagination: {
      pageSize: pageSize,
      page: currentPage,
    },
    sort: ["createdAt:desc"],
  });

  const response = await getSummaries(queryString);
  const summaries = response?.data || [];
  const pageCount = response?.meta?.pagination?.pageCount || 1;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Мої конспекти</h1>
      
      {/* Додаємо наш новий пошук */}
      <Search />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaries.map((item: any) => (
           <div key={item.documentId} className="bg-white p-6 rounded-xl border flex flex-col justify-between shadow-sm">
             <h2 className="text-xl font-bold mb-2 text-black">{item.title}</h2>
             <Link 
               href={`/dashboard/summaries/${item.documentId}`}
               className="mt-4 text-center bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100"
             >
               Переглянути
             </Link>
           </div>
        ))}
      </div>

      {/* ДОДАЄМО КНОПКИ ТУТ */}
      <Pagination pageCount={pageCount} />
    </div>
  );
}