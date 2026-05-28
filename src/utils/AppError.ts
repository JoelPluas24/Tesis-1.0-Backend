export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Error.captureStackTrace ensures the constructor call itself doesn't appear in the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
