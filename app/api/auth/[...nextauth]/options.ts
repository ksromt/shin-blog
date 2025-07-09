import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma/prisma";

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
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

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
  adapter: PrismaAdapter(prisma),
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
  // 强制使用数据库session策略，完全禁用JWT
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // 明确禁用JWT
  jwt: {
    encode: async () => {
      // 返回空字符串，禁用JWT编码
      return "";
    },
    decode: async () => {
      // 返回null，禁用JWT解码
      return null;
    },
  },
  // 使用默认cookie配置，但确保路径正确
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true // HTTPS环境
      }
    },
    csrfToken: {
      name: `next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `next-auth.callback-url`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  // 启用调试模式以获取更多错误信息
  debug: true,
  // 数据库session策略的回调
  callbacks: {
    async session({ session, user }) {
      try {
        // 添加用户ID到session
        if (session.user) {
          session.user.id = user.id;
        }
        console.log('Session callback called:', { 
          sessionExists: !!session, 
          userExists: !!user,
          userEmail: session.user?.email,
          userId: user?.id 
        });
        return session;
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
    async signIn({ user, account, profile }) {
      try {
        console.log('SignIn callback called:', { 
          userEmail: user.email, 
          provider: account?.provider,
          accountExists: !!account,
          userId: user.id,
          accountId: account?.providerAccountId
        });
        
        // 检查用户是否已存在
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email || '' },
          include: { accounts: true }
        });
        
        console.log('Existing user check:', {
          found: !!existingUser,
          accountsCount: existingUser?.accounts.length || 0,
          hasGithubAccount: existingUser?.accounts.some(acc => acc.provider === 'github') || false
        });
        
        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        // 即使有错误也返回true，让NextAuth继续处理
        return true;
      }
    },
    // 暂时移除redirect callback，让NextAuth使用默认重定向逻辑
    // async redirect({ url, baseUrl }) {
    //   console.log('Redirect callback called:', { url, baseUrl });
    //   // 确保重定向到正确的URL
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // 允许重定向到同一域名
    //   if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
  // 事件处理器，用于调试
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('SignIn event:', { userEmail: user.email, provider: account?.provider, isNewUser });
    },
    async session({ session, token }) {
      console.log('Session event:', { userEmail: session.user?.email });
    },
  },
}; 