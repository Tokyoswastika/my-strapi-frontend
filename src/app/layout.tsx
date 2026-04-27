import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import qs from "qs";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { getUserMeLoader } from "../data/services/get-user-me-loader";
import { logoutAction } from "../data/actions/auth-actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Summarize AI",
  description: "Transform long videos into concise summaries instantly.",
};

// 1. Створюємо запит для отримання глобальних даних (Шапка і Підвал)
const globalQuery = qs.stringify({
  populate: {
    header: {
      populate: {
        ctaButton: {
          populate: true,
        },
      },
    },
    footer: {
      populate: true,
    },
  },
});

// 2. Функція для витягування даних зі Strapi
async function getGlobalData() {
  try {
    const res = await fetch(`http://localhost:1337/api/global?${globalQuery}`, {
      // next: { revalidate: 60 } // Можна увімкнути кешування пізніше
      cache: "no-store" 
    });
    
    if (!res.ok) throw new Error("Не вдалося завантажити Global дані");
    return res.json();
  } catch (error) {
    console.error(error);
    return null; // Якщо помилка, повертаємо null, щоб сайт не впав
  }
}

// 3. Головний Layout сайту
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const globalData = await getGlobalData();
  // Викликаємо нашу функцію, щоб перевірити, чи є користувач
  const user = await getUserMeLoader(); 
  
  const header = globalData?.data?.header;
  const footer = globalData?.data?.footer;

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50`} suppressHydrationWarning={true}>
        
        {header && (
          <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
              <Link href="/" className="font-bold text-xl tracking-tight">
                {header.logoText}
              </Link>
              
              {/* РОЗУМНА ЛОГІКА КНОПОК */}
              <div className="flex items-center gap-4">
                {user.ok ? (
                  // Якщо залогінений: показуємо лінк на кабінет і кнопку Вийти
                  <>
                    <Link href="/dashboard" className="font-semibold text-sm hover:underline">
                      Dashboard
                    </Link>
                    <form action={logoutAction}>
                      <Button variant="outline">Logout</Button>
                    </form>
                  </>
                ) : (
                  // Якщо ГІСТЬ: показуємо кнопку зі Strapi
                  header.ctaButton && (
                    <Link href={header.ctaButton.url} target={header.ctaButton.isExternal ? "_blank" : "_self"}>
                      <Button>{header.ctaButton.text}</Button>
                    </Link>
                  )
                )}
              </div>

            </div>
          </header>
        )}

        <main className="flex-1">
          {children}
        </main>

        {footer && (
          <footer className="w-full border-t bg-slate-50 py-6 dark:bg-slate-900 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm text-muted-foreground">{footer.text}</p>
            </div>
          </footer>
        )}

      </body>
    </html>
  );
}