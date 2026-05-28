import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/response.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message}`);
    return ApiResponse.error(res, err.message, err.statusCode);
  }

  logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
  return ApiResponse.error(res, 'Error interno del servidor', 500);
};
