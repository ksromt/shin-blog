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
  // 强制使用数据库session策略
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // 完全禁用自定义cookies，使用默认配置
  // cookies: 注释掉自定义cookies配置，让NextAuth使用默认值
  secret: process.env.NEXTAUTH_SECRET,
  // 数据库session策略的回调
  callbacks: {
    async session({ session, user }) {
      // 添加用户ID到session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
}; 