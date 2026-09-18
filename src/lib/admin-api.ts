/**
 * Appel des routes /api/admin/* depuis les pages admin.
 * Toutes les écritures passent par le serveur (clé service + contrôle du rôle admin) :
 * le navigateur n'écrit jamais directement dans Supabase.
 */
export async function adminApi<T = unknown>(
  path: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown } = {}
): Promise<T> {
  const { method = 'GET', body } = options
  const res = await fetch(`/api/admin/${path}`, {
    method,
    cache: 'no-store',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (res.status === 401) {
    window.location.href = '/admin/login'
  }
  if (!res.ok) {
    throw new Error(data?.error || `Erreur ${res.status}`)
  }
  return data as T
}
