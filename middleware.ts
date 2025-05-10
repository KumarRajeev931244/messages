import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request})
    const url = request.nextUrl
    console.log("URL:", url)
    // agar hamere pass token aur hum signIn page pe kiya karne ja rahe ho. because token means u r login
    if(token && 
        (
            url.pathname.startsWith('/signIn') ||
            url.pathname.startsWith('/signUp') ||
            url.pathname.startsWith('/verify')  ||
            url.pathname.startsWith('/')
        )
    ){
         return NextResponse.redirect(new URL('/dashboard', request.url))
    }
 
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/signIn',
    '/signUp',
    '/',
    '/dashboard/:path*',
    '/verify/:path*'
  ],
}