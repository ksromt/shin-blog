import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),

  // Admin
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email'),

  // OAuth providers (optional - app works without them, auth just won't be available)
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // RAG API (Rust Doc Assistant)
  RAG_API_URL: z.string().url().optional().default('http://localhost:8001'),
  OPENAI_API_KEY: z.string().optional(),

  // Koclaw Integration (optional - only needed when Koclaw gateway is running)
  KOCLAW_GATEWAY_URL: z.string().url().optional(),
  NEXT_PUBLIC_KOCLAW_WS_URL: z.string().optional(),
  NEXT_PUBLIC_KOCLAW_ASSETS_URL: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error('Invalid environment variables:', errors);
    throw new Error(`Invalid environment configuration: ${Object.keys(errors).join(', ')}`);
  }
  return result.data;
}

export const env = validateEnv();
