import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/prisma";

export async function GET() {
  try {
    // 清理数据库中的所有过期session
    const now = new Date();
    const deletedSessions = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: now
        }
      }
    });

    console.log(`Deleted ${deletedSessions.count} expired sessions from database`);

    // 准备response
    const response = new NextResponse("All auth cookies and sessions cleared", { 
      status: 200,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      }
    });

    // 定义所有可能的cookie名称
    const cookieNames = [
      // NextAuth 4.x cookies (多种变体)
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      '__Host-next-auth.session-token',
      'next-auth.csrf-token',
      '__Host-next-auth.csrf-token',
      '__Secure-next-auth.csrf-token',
      'next-auth.callback-url',
      '__Secure-next-auth.callback-url',
      '__Host-next-auth.callback-url',
      'next-auth.pkce.code_verifier',
      '__Secure-next-auth.pkce.code_verifier',
      '__Host-next-auth.pkce.code_verifier',
      'next-auth.state',
      '__Host-next-auth.state',
      '__Secure-next-auth.state',
      'next-auth.nonce',
      '__Host-next-auth.nonce',
      '__Secure-next-auth.nonce',
      
      // Legacy和其他可能的变体
      'nextauth.session-token',
      'nextauth.csrf-token',
      'nextauth.callback-url',
      'authjs.session-token',
      'authjs.csrf-token',
      'authjs.callback-url',
    ];

    // 定义多个域和路径组合
    const domains = ['', '.arcadiaeden.com', 'arcadiaeden.com'];
    const paths = ['/', '/api', '/api/auth'];

    // 清除每个cookie的所有变体
    cookieNames.forEach(cookieName => {
      domains.forEach(domain => {
        paths.forEach(path => {
          // 基本清除
          let cookieString = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0`;
          
          // 添加域（如果指定）
          if (domain) {
            cookieString += `; Domain=${domain}`;
          }
          
          // 添加安全属性
          cookieString += '; Secure; SameSite=Lax';
          
          // 对于__Host-前缀的cookie，移除Domain
          if (cookieName.startsWith('__Host-') && domain) {
            cookieString = `${cookieName}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Secure; SameSite=Lax`;
          }
          
          // 对于__Secure-前缀的cookie，确保Secure
          if (cookieName.startsWith('__Secure-')) {
            cookieString += '; HttpOnly';
          }

          response.headers.append('Set-Cookie', cookieString);
        });
      });
      
      // 额外的HTTP-only版本
      response.headers.append('Set-Cookie', `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Secure; HttpOnly; SameSite=Lax`);
    });

    console.log(`Cleared ${cookieNames.length} cookie types across ${domains.length} domains and ${paths.length} paths`);
    
    return response;
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
    return new NextResponse("Error clearing cookies", { status: 500 });
  }
}

export async function POST() {
  // POST方法做同样的事情，为了兼容性
  return GET();
} 