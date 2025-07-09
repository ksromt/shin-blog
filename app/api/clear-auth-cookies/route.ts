import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = new NextResponse('Cookies cleared', { status: 200 });
  
  // 清除所有可能的NextAuth相关cookies
  const cookiesToClear = [
    '__Secure-next-auth.session-token',
    '__Host-next-auth.csrf-token',
    '__Secure-next-auth.callback-url',
    'next-auth.session-token',
    'next-auth.csrf-token',
    'next-auth.callback-url',
    '__Secure-next-auth.pkce.code_verifier',
    'next-auth.pkce.code_verifier',
    '__Host-next-auth.state',
    'next-auth.state',
  ];
  
  cookiesToClear.forEach(cookieName => {
    // 设置过期时间为过去，清除cookie
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      domain: '.arcadiaeden.com',
    });
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
      domain: 'arcadiaeden.com',
    });
    response.cookies.set(cookieName, '', {
      expires: new Date(0),
      path: '/',
    });
  });
  
  return response;
} 