import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Rutas que no requieren autenticación
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/activate',
  '/2fa',
  '/unauthorized',
]

// Rutas solo para ciertos roles
const ROLE_ROUTES: Record<string, string[]> = {
  '/audit': ['ADMIN'],
  '/users': ['ADMIN', 'OPERATOR'],
  '/clients': ['ADMIN', 'OPERATOR'],
  '/drivers': ['ADMIN', 'OPERATOR'],
  '/trucks': ['ADMIN', 'OPERATOR', 'DRIVER'],
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Obtener token del localStorage no es posible en middleware
  // Usamos una cookie que seteamos al hacer login
  const token = request.cookies.get('auth-token')?.value
  const role = request.cookies.get('auth-role')?.value

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route))

  // Si no está autenticado y trata de acceder a ruta protegida
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si está autenticado y trata de acceder a auth routes
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Verificar permisos por rol
  if (token && role) {
    const requiredRoles = Object.entries(ROLE_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    )?.[1]

    if (requiredRoles && !requiredRoles.includes(role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
