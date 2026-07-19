'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AUTH_CONFIG, isAdmin } from '@/lib/auth-config';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still checking session

    if (!session) {
      // Not logged in
      return;
    }

    // Check if user is authorized admin
    if (isAdmin(session.user?.email)) {
      setIsAuthorized(true);
    } else {
      // Logged in but not authorized
      setIsAuthorized(false);
    }
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      alert('Unauthorized access');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get user ID from email
      const userResponse = await fetch('/api/user/by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user');
      }

      const { user } = await userResponse.json();

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorId: user.id,
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          published,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const { post } = await response.json();
      alert('文章创建成功！Post created successfully!');
      
      // Clear form
      setTitle('');
      setContent('');
      setTags('');
      setPublished(true);
      
      // Optionally navigate to the new post
      if (published) {
        router.push(`/blog/${post.id}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('创建文章失败 / Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishAll = async () => {
    if (!session?.user?.email || !isAdmin(session.user.email)) {
      alert('Unauthorized access');
      return;
    }

    if (!confirm('确定要发布所有未发布的文章吗？ / Are you sure you want to publish all unpublished posts?')) {
      return;
    }

    setIsPublishingAll(true);
    try {
      const response = await fetch('/api/posts/publish-all', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to publish all posts');
      }

      const result = await response.json();
      alert(`成功发布了 ${result.updatedCount} 篇文章！ / Successfully published ${result.updatedCount} posts!`);
    } catch (error) {
      console.error('Error publishing all posts:', error);
      alert('发布文章失败 / Failed to publish posts');
    } finally {
      setIsPublishingAll(false);
    }
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>正在验证权限... / Verifying permissions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">管理员登录 / Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-muted-foreground">
              请使用 Google 账户登录以访问管理面板
              <br />
              Please sign in with Google to access the admin panel
            </p>
            <Button 
              onClick={() => signIn('google')}
              className="w-full max-w-sm"
            >
              使用 Google 登录 / Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Logged in but not authorized
  if (!isAuthorized) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center text-destructive">
              访问被拒绝 / Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-muted-foreground">
              抱歉，您没有访问此页面的权限。
              <br />
              Sorry, you don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              当前登录用户: {session.user?.email}
              <br />
              Currently signed in as: {session.user?.email}
            </p>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
            >
              返回首页 / Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authorized admin view
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            🔐 管理员面板 / Admin Panel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">管理员 / Admin</Badge>
            <span className="text-sm text-muted-foreground">
              {session.user?.email}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                标题 / Title
              </label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题... / Enter post title..."
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                内容 / Content (Markdown 格式)
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你的文章内容... / Write your post content..."
                required
                className="w-full min-h-[400px]"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                标签 / Tags (用逗号分隔 / separated by commas)
              </label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="例如 / e.g.: Next.js, React, TypeScript"
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="published" className="text-sm font-medium">
                立即发布 / Publish immediately
              </label>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? '创建中... / Creating...' : '创建文章 / Create Post'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">管理工具 / Admin Tools</h3>
            <Button 
              onClick={handlePublishAll}
              disabled={isPublishingAll}
              variant="outline"
              className="w-full"
            >
              {isPublishingAll ? '发布中... / Publishing...' : '发布所有未发布文章 / Publish All Unpublished Posts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Markdown 语法指南 / Markdown Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">基本语法 / Basic Syntax:</h4>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><code># 标题1</code> - 一级标题 / H1 heading</li>
                <li><code>## 标题2</code> - 二级标题 / H2 heading</li>
                <li><code>**粗体**</code> - 粗体文字 / Bold text</li>
                <li><code>*斜体*</code> - 斜体文字 / Italic text</li>
                <li><code>`代码`</code> - 内联代码 / Inline code</li>
                <li><code>[链接](URL)</code> - 链接 / Links</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">代码块 / Code Blocks:</h4>
              <pre className="bg-muted text-foreground p-2 rounded mt-2">
{`\`\`\`javascript
console.log('Hello World');
\`\`\``}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 