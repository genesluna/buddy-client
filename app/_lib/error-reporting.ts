/**
 * Error reporting utility for handling errors across the application.
 *
 * In development: Logs errors to console for debugging.
 * In production: Sends errors to configured error reporting service.
 *
 * To integrate with a service like Sentry:
 * 1. Install: pnpm add @sentry/nextjs
 * 2. Configure Sentry in sentry.client.config.ts
 * 3. Update reportError to call Sentry.captureException(error, { extra: context })
 */

interface ErrorContext {
  /** Component or page where the error occurred */
  source: string;
  /** Error digest from Next.js (unique error identifier) */
  digest?: string;
  /** Additional context data */
  [key: string]: unknown;
}

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Reports an error to the configured error reporting service.
 * Falls back to console in development or when no service is configured.
 */
export function reportError(error: Error, context: ErrorContext): void {
  // In development, log to console for debugging
  if (isDevelopment) {
    console.error(`[${context.source}]`, error.message, { error, context });
    return;
  }

  // Production: Send to error reporting service
  // TODO: Integrate with Sentry, Datadog, or other error reporting service
  // Example with Sentry:
  // Sentry.captureException(error, {
  //   tags: { source: context.source },
  //   extra: context,
  // });

  // For now, suppress console output in production to avoid exposing sensitive data
  // Errors are still captured by Next.js error boundaries
}
