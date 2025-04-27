'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/guestbook';
  const { data: session, status } = useSession();
  
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    github: false,
    google: false
  });

  // 如果已登录，则自动重定向到回调URL或留言簿页面
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSignIn = async (provider: string) => {
    setIsLoading({ ...isLoading, [provider]: true });
    // 直接指定callbackUrl，不依赖于signIn函数的重定向
    await signIn(provider, { 
      callbackUrl,
      redirect: true
    });
    setIsLoading({ ...isLoading, [provider]: false });
  };

  // 如果用户已登录，显示加载状态
  if (status === 'authenticated') {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <p className="text-lg mb-4">登录成功，正在跳转...</p>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">登录</h1>
          <p className="mt-2 text-gray-600">
            请选择您要使用的登录方式
          </p>
        </div>

        <div className="space-y-4 mt-8">
          <Button 
            className="w-full" 
            onClick={() => handleSignIn('github')}
            disabled={isLoading.github}
          >
            {isLoading.github ? '登录中...' : '使用 GitHub 登录'}
          </Button>
          
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => handleSignIn('google')}
            disabled={isLoading.google}
          >
            {isLoading.google ? '登录中...' : '使用 Google 登录'}
          </Button>
          
          <div className="text-center mt-4">
            <button 
              onClick={() => router.push('/guestbook')} 
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              返回留言簿
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 