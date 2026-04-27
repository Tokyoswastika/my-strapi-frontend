"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  pageCount: number;
}

export function Pagination({ pageCount }: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <button
        onClick={() => createPageURL(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-black hover:bg-gray-200 transition"
      >
        Назад
      </button>

      <span className="text-sm font-medium text-black">
        Сторінка {currentPage} з {pageCount}
      </span>

      <button
        onClick={() => createPageURL(currentPage + 1)}
        disabled={currentPage >= pageCount}
        className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50 text-black hover:bg-gray-200 transition"
      >
        Вперед
      </button>
    </div>
  );
}
