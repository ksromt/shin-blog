import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string) {
    return new ApiError(400, message, 'BAD_REQUEST');
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message, 'FORBIDDEN');
  }

  static notFound(resource = 'Resource') {
    return new ApiError(404, `${resource} not found`, 'NOT_FOUND');
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.') {
    return new ApiError(429, message, 'RATE_LIMITED');
  }

  static internal(message = 'Internal server error') {
    return new ApiError(500, message, 'INTERNAL');
  }
}

/**
 * Convert any error into a standardized JSON response.
 */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const messages = error.errors.map((e) => e.message).join(', ');
    return NextResponse.json(
      { error: messages, code: 'VALIDATION_ERROR' },
      { status: 400 }
    );
  }

  console.error('Unhandled API error:', error);
  return NextResponse.json(
    { error: 'Internal server error', code: 'INTERNAL' },
    { status: 500 }
  );
}
