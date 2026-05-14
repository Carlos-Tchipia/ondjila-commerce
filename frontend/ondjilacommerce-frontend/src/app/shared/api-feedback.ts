export function apiErrorMessage(error: any, fallback: string): string {
  if (error?.name === 'TimeoutError') {
    return 'O servidor demorou demasiado a responder. Tente novamente.';
  }

  if (typeof error?.error === 'string' && error.error.trim() !== '') {
    return error.error;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}
