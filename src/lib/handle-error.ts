import { toast } from 'sonner';

/**
 * Handle error utility
 * Shows toast notification and logs error to console
 * Does not throw the error
 */
export function handleError(
  error: unknown,
  defaultMessage: string = 'An error occurred. Please try again.'
): void {
  // Extract error message
  const errorMessage =
    error && typeof error === 'object' && 'message' in error
      ? String(error.message)
      : defaultMessage;

  // Log error to console for debugging
  console.log('Error:', error);

  // Show toast notification
  toast.error(errorMessage);
}
