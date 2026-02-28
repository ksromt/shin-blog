import { NextRequest } from 'next/server';
import { rateLimit, getClientIp } from '@/lib/api/rate-limit';
import { ApiError, errorResponse } from '@/lib/api/errors';
import { z } from 'zod';

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  language: z.enum(['en', 'ja', 'zh']).optional().default('en'),
});

/**
 * POST /api/koclaw — Proxy chat requests to Koclaw gateway.
 * Streams SSE responses back to the client.
 * Gracefully returns 503 when Koclaw is not running.
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 requests per minute per IP
    const ip = getClientIp(request);
    if (!rateLimit(`koclaw:${ip}`, 10, 60_000)) {
      throw ApiError.tooManyRequests();
    }

    const body = await request.json();
    const { message, language } = chatSchema.parse(body);

    const gatewayUrl = process.env.KOCLAW_GATEWAY_URL;
    if (!gatewayUrl) {
      return Response.json(
        {
          error: 'SERVICE_UNAVAILABLE',
          message: 'Koclaw service is not configured. Set KOCLAW_GATEWAY_URL to enable.',
        },
        { status: 503 }
      );
    }

    // Forward to Koclaw gateway
    const koclawResponse = await fetch(`${gatewayUrl}/api/v1/chat/public`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language }),
    });

    if (!koclawResponse.ok) {
      return Response.json(
        {
          error: 'GATEWAY_ERROR',
          message: `Koclaw returned ${koclawResponse.status}`,
        },
        { status: 502 }
      );
    }

    // Stream SSE response back to client
    if (koclawResponse.headers.get('content-type')?.includes('text/event-stream')) {
      return new Response(koclawResponse.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming response
    const data = await koclawResponse.json();
    return Response.json(data);
  } catch (error) {
    return errorResponse(error);
  }
}
