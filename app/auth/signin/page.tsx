'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const { data: session, status } = useSession();

  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    github: false,
    google: false
  });

  // If already logged in, redirect to callback URL
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push(callbackUrl);
    }
  }, [status, session, router, callbackUrl]);

  const handleSignIn = async (provider: string) => {
    setIsLoading({ ...isLoading, [provider]: true });
    await signIn(provider, {
      callbackUrl,
      redirect: true
    });
    setIsLoading({ ...isLoading, [provider]: false });
  };

  // If user is already logged in, show loading state
  if (status === 'authenticated') {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <p className="text-lg mb-4 text-foreground">Redirecting...</p>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md border border-border">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
          <p className="mt-2 text-muted-foreground">
            Choose your sign-in method
          </p>
        </div>

        <div className="space-y-4 mt-8">
          <Button
            className="w-full"
            onClick={() => handleSignIn('github')}
            disabled={isLoading.github}
          >
            {isLoading.github ? 'Signing in...' : 'Sign in with GitHub'}
          </Button>

          <Button
            className="w-full"
            variant="outline"
            onClick={() => handleSignIn('google')}
            disabled={isLoading.google}
          >
            {isLoading.google ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="text-center mt-4">
            <button
              onClick={() => router.push('/')}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md border border-border">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Loading...</h1>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mt-4"></div>
          </div>
        </div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
