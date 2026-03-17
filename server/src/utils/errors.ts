/**
 * HTTP error with status code for use in route handlers.
 * Throw this (or pass to next()) so the global error handler can send the correct status and message.
 */
export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
