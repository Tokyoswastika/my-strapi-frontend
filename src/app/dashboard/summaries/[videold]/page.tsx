import { getSummaryById } from "../../../../data/loaders";
import { SummaryUpdateForm } from "../../../../components/forms/SummaryUpdateForm";

export default async function SummaryRoute({ params }: { params: any }) {
  const { videold } = await params;
  const response = await getSummaryById(videold);
  const item = response?.data;

  if (!item) return <p className="p-10 text-center">Підсумок не знайдено.</p>;

  // Перетворюємо блоки Strapi в один рядок тексту для нашої форми
  const summaryText = item.summary
    ?.map((block: any) => 
      block.children?.map((child: any) => child.text).join("")
    ).join("\n\n") || "";

  // Готуємо об'єкт для форми
  const formItem = {
    documentId: item.documentId,
    title: item.title,
    summary: summaryText
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Редагування конспекту</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        {/* ВИКЛИКАЄМО НАШУ ФОРМУ */}
        <SummaryUpdateForm item={formItem} />
      </div>
    </div>
  );
}