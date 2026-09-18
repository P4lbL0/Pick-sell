import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const LOGIN_PATH = '/admin/login'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  // Rafraîchit la session si besoin (écrit les nouveaux cookies dans la réponse)
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = user?.app_metadata?.role === 'admin'
  const { pathname } = request.nextUrl

  if (pathname === LOGIN_PATH) {
    if (isAdmin) return NextResponse.redirect(new URL('/admin', request.url))
    return response
  }

  if (isAdmin) return response

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: user ? 'Accès refusé' : 'Non connecté' }, { status: user ? 403 : 401 })
  }

  const loginUrl = new URL(LOGIN_PATH, request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload'],
}
