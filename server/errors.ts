export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export function responseError(error: unknown) {
  if (error instanceof HttpError) return error;
  return new HttpError(502, 'Unable to load Hacker News. Please try again.');
}
