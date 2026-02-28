import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { isAdmin } from '@/lib/auth-config';
import { ApiError, errorResponse } from './errors';
import type { Session } from 'next-auth';

export type RouteContext = { params: Promise<Record<string, string>> };

export type Handler = (
  request: NextRequest,
  context?: RouteContext
) => Promise<NextResponse>;

export type AuthHandler = (
  request: NextRequest,
  session: Session,
  context?: RouteContext
) => Promise<NextResponse>;

/**
 * Wraps a route handler with standardized error handling.
 * Catches ApiError, ZodError, and unexpected errors.
 */
export function withErrorHandling(handler: Handler): Handler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/**
 * Requires authentication. Injects the session into the handler.
 * Returns 401 if not authenticated.
 */
export function withAuth(handler: AuthHandler): Handler {
  return withErrorHandling(async (request, context) => {
    const session = await getServerSession(options);
    if (!session?.user) {
      throw ApiError.unauthorized();
    }
    return handler(request, session, context);
  });
}

/**
 * Requires admin authentication. Injects the session into the handler.
 * Returns 401 if not authenticated, 403 if not admin.
 */
export function withAdmin(handler: AuthHandler): Handler {
  return withErrorHandling(async (request, context) => {
    const session = await getServerSession(options);
    if (!session?.user) {
      throw ApiError.unauthorized();
    }
    if (!isAdmin(session.user.email)) {
      throw ApiError.forbidden('Only admin can perform this action');
    }
    return handler(request, session, context);
  });
}
