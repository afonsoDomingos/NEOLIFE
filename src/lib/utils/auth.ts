import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function requireAuth(): Promise<void> {
  const auth = await isAuthenticated();
  if (!auth) {
    throw new Error('Unauthorized');
  }
}