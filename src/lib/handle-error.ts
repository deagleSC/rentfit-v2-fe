import { toast } from 'sonner';
import { handle401Error } from './handle-401';

/**
 * Handle error utility
 * Shows toast notification and logs error to console
 * Does not throw the error
 * Automatically handles 401 errors by clearing stores and logging out
 */
export function handleError(
  error: unknown,
  defaultMessage: string = 'An error occurred. Please try again.'
): void {
  // Check if error has a status property (from API responses)
  const errorStatus =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status?: number }).status
      : undefined;

  // Handle 401 Unauthorized errors
  if (errorStatus === 401 && !window.location.pathname.startsWith('/auth')) {
    handle401Error().catch((err) => {
      console.error('Error in handle401Error:', err);
    });
    toast.error('Your session has expired. Please log in again.');
    return;
  }

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
