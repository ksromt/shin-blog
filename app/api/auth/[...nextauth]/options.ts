import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// 暂时注释掉 Prisma 适配器以排除数据库问题
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/lib/prisma/prisma";

// 确保加载环境变量
if (typeof window === "undefined") {
  require('dotenv').config({ path: '.env.local' });
}

// 调试日志
console.log('NextAuth Options - Environment Check:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('GITHUB_ID exists:', !!process.env.GITHUB_ID);
console.log('GITHUB_SECRET exists:', !!process.env.GITHUB_SECRET);
console.log('GOOGLE_CLIENT_ID exists:', !!process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET exists:', !!process.env.GOOGLE_CLIENT_SECRET);

// 扩展Session类型以包含用户ID
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const options: NextAuthOptions = {
  // 暂时不使用数据库适配器
  // adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 将用户信息保存到 JWT token
      if (account) {
        token.accessToken = account.access_token;
        token.id = (profile as any)?.id || profile?.sub;
      }
      return token;
    },
    async session({ session, token }) {
      // 将用户信息传递到 session
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 确保重定向到正确的URL
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },
  // 使用 JWT 会话策略（不依赖数据库）
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // 生产环境安全配置
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true, // 生产环境强制使用 HTTPS
      },
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  // 添加调试模式以便于排查问题
  debug: process.env.NODE_ENV === 'development',
}; 