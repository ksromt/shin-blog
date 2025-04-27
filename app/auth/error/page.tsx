'use client';

import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: {[key: string]: string} = {
    default: '登录过程中出现错误',
    AccessDenied: '访问被拒绝',
    Verification: '验证链接已过期或已被使用',
    OAuthSignin: '尝试开始OAuth流程时出错',
    OAuthCallback: 'OAuth回调时出错',
    OAuthCreateAccount: '创建OAuth账户时出错',
    EmailCreateAccount: '创建邮箱账户时出错',
    CallbackUrlMismatch: '回调URL不匹配配置',
    OAuthAccountNotLinked: '此邮箱与其他账户关联',
    Configuration: '服务器配置错误',
    CredentialsSignin: '登录失败，请检查提供的凭据'
  };

  const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600">登录失败</h1>
        <p className="mt-4 text-gray-700">{errorMessage}</p>
        
        <div className="mt-8 space-y-4">
          <Button 
            className="w-full"
            onClick={() => router.push('/auth/signin')}
          >
            重试登录
          </Button>
          
          <Button 
            className="w-full"
            variant="outline"
            onClick={() => router.push('/')}
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
} 