'use client';

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
    setIsLoading(false);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold">退出登录</h1>
        
        {session?.user ? (
          <div className="mt-4">
            <p className="text-gray-700 mb-6">
              您确定要退出账户 <strong>{session.user.name || session.user.email}</strong> 吗？
            </p>
            
            <div className="flex flex-col space-y-4">
              <Button 
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? '退出中...' : '确认退出'}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                取消
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-gray-700 mb-6">
              您当前未登录
            </p>
            
            <Button onClick={() => router.push('/')}>
              返回首页
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 