"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSummaryAction(documentId: string, payload: { title: string, summary: string }) {
  
  // 1. Формуємо дані для Strapi (важливо: загортаємо в об'єкт data)
  const dataToSend = {
    data: {
      title: payload.title,
      summary: payload.summary,
    }
  };

  try {
    const response = await fetch(`http://localhost:1337/api/summaries/${documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Тут пізніше додамо токен авторизації, якщо закриєш права на Update
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error("Не вдалося оновити дані в Strapi");
    }

    // 2. Очищуємо кеш Next.js, щоб він заново завантажив свіжі дані
    revalidatePath("/dashboard/summaries");
    revalidatePath(`/dashboard/summaries/${documentId}`);

    return { success: true };
  } catch (error) {
    console.error("Помилка оновлення:", error);
    return { success: false, error: "Помилка сервера при оновленні" };
  }
}

export async function deleteSummaryAction(documentId: string) {
  try {
    const response = await fetch(`http://localhost:1337/api/summaries/${documentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Не вдалося видалити запис");
    }

    // Після видалення нам немає сенсу лишатися на цій сторінці, 
    // тому перенаправляємо користувача назад до списку всіх конспектів
    revalidatePath("/dashboard/summaries");
  } catch (error) {
    console.error("Помилка видалення:", error);
    return { error: "Не вдалося видалити" };
  }
  
  redirect("/dashboard/summaries");
}

export async function createSummaryAction(videoUrl: string) {
  // Тут зазвичай іде логіка виклику AI, але для тесту Lab 7 
  // можна просто створити пустий запис у Strapi
  try {
    const response = await fetch("http://localhost:1337/api/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          title: "Новий конспект",
          videoId: videoUrl,
          summary: [{ type: "paragraph", children: [{ type: "text", text: "Генерація тексту..." }] }]
        }
      }),
    });

    if (!response.ok) throw new Error("Помилка створення");
    
    revalidatePath("/dashboard/summaries");
    return { success: true };
  } catch (e) {
    return { error: "Не вдалося створити запис у Strapi" };
  }
}