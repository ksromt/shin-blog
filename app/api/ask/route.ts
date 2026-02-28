import { z } from 'zod';
import { ApiError, errorResponse } from '@/lib/api/errors';
import { rateLimit, getClientIp } from '@/lib/api/rate-limit';

const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8001';

const querySchema = z.object({
  question: z.string().min(1, 'Question is required').max(2000, 'Question too long'),
  language: z.enum(['en', 'ja', 'zh']).optional().default('en'),
});

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    if (!rateLimit(`ask:${clientIp}`, 10, 60_000)) {
      throw ApiError.tooManyRequests();
    }

    const body = await request.json();
    const { question, language } = querySchema.parse(body);

    const response = await fetch(`${RAG_API_URL}/api/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, language }),
    });

    if (!response.ok) {
      throw ApiError.internal('RAG API error');
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    if (error instanceof ApiError || error instanceof z.ZodError) {
      return errorResponse(error);
    }
    return errorResponse(
      ApiError.internal('Failed to connect to RAG API. Make sure the AI assistant service is running.')
    );
  }
}
