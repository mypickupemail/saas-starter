import { NextResponse } from 'next/server';
import {auth} from '@/lib/auth/base'

const protectedRoutes = '/dashboard';

export const middleware =  auth((request)=>{
  const { pathname } = request.nextUrl;
  const user = request.auth?.user
  const isProtectedRoute = pathname.startsWith(protectedRoutes);

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
