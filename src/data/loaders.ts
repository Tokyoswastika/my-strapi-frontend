export async function getSummaryById(id: string) {
  try {
    const res = await fetch(`http://localhost:1337/api/summaries/${id}`);
    if (res.ok) {
      return await res.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSummaries(queryString: string = "") {
  // Додаємо queryString до запиту. Strapi 5 чудово розуміє параметри пошуку.
  const url = `http://localhost:1337/api/summaries?${queryString}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: 'no-store'
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching summaries:", error);
  }
}