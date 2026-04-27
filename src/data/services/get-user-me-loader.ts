import { cookies } from 'next/headers';

export async function getUserMeLoader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return { ok: false };

  try {
    const res = await fetch('http://localhost:1337/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) {
      const user = await res.json();
      return { ok: true, user };
    } else {
      return { ok: false };
    }
  } catch (error) {
    console.error(error);
    return { ok: false };
  }
}