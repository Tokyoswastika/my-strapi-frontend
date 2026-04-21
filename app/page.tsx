import { Button } from "@/components/ui/button";
import qs from "qs";
import Link from "next/link";
import Image from "next/image";
import { Clock, CheckCircle, Cloud } from "lucide-react"; // Імпортуємо іконки

// ОНОВЛЕНИЙ ЗАПИТ: Тепер ми просимо у Strapi віддати дані обох секцій
const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "blocks.hero-section": {
          populate: {
            image: {
              fields: ["url", "alternativeText"],
            },
            link: {
              populate: true,
            },
          },
        },
        // ДОДАЛИ ЗАПИТ ДЛЯ НОВОЇ СЕКЦІЇ ПЕРЕВАГ
        "blocks.features-section": {
          populate: {
            feature: {
              populate: true,
            },
          },
        },
      },
    },
  },
});

async function getHomePageData() {
  const res = await fetch(`http://localhost:1337/api/home-page?${homePageQuery}`);
  if (!res.ok) {
    throw new Error(`Не вдалося завантажити дані. Статус: ${res.status}`);
  }
  return res.json();
}

// Допоміжна функція, яка перетворює текст зі Strapi (CLOCK) на реальну іконку
function FeatureIcon({ name }: { name: string }) {
  switch (name) {
    case "CLOCK":
      return <Clock className="w-12 h-12 mb-4 text-blue-500" />;
    case "CHECK":
      return <CheckCircle className="w-12 h-12 mb-4 text-green-500" />;
    case "CLOUD":
      return <Cloud className="w-12 h-12 mb-4 text-purple-500" />;
    default:
      return null;
  }
}

export default async function Home() {
  const strapiData = await getHomePageData();
  
  if (!strapiData?.data?.blocks) {
    return <div className="p-20 text-center text-xl">Блоки не знайдені.</div>;
  }

  // Розумний пошук: шукаємо потрібний блок за його типом (__component)
  const heroSection = strapiData.data.blocks.find((block: any) => block.__component === "blocks.hero-section");
  const featuresSection = strapiData.data.blocks.find((block: any) => block.__component === "blocks.features-section");

  const imageUrl = heroSection?.image?.url ? `http://localhost:1337${heroSection.image.url}` : null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      
      {/* 1. HERO SECTION */}
      {heroSection && (
        <section className="container mx-auto py-20 flex flex-col items-center text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">{heroSection.heading}</h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            {heroSection.subHeading}
          </p>

          {imageUrl && (
            <div className="relative w-full max-w-2xl h-64 my-8 rounded-lg overflow-hidden shadow-lg">
               <Image 
                 src={imageUrl} 
                 alt={heroSection.image?.alternativeText || "Hero Image"}
                 fill
                 className="object-cover"
               />
            </div>
          )}
          
          {heroSection.link && (
            <Link href={heroSection.link.url} target={heroSection.link.isExternal ? "_blank" : "_self"}>
              <Button size="lg" className="mt-4">
                {heroSection.link.text}
              </Button>
            </Link>
          )}
        </section>
      )}

      {/* 2. FEATURES SECTION */}
      {featuresSection && (
        <section className="w-full py-24 bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 text-center">
            
            {/* Заголовок та опис секції */}
            <h2 className="text-3xl font-bold mb-4">{featuresSection.title}</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              {featuresSection.description}
            </p>

            {/* Сітка з картками (масив) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {featuresSection.feature.map((feat: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border flex flex-col items-center text-center hover:shadow-md transition-shadow"
                >
                  <FeatureIcon name={feat.icon} />
                  <h3 className="text-xl font-semibold mb-2">{feat.heading}</h3>
                  <p className="text-muted-foreground">{feat.subHeading}</p>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

    </main>
  );
}
