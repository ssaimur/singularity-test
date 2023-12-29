import { MESSAGES } from '../constants/messages';
import { HttpStatusCode } from './httpStatusCode';

/**
 * All error handlings
 */
export const SUCCESSE = HttpStatusCode.OK; // 200
export const ERROR_UNAUTHORIZED = HttpStatusCode.UNAUTHORIZED; // 401
export const ERROR_UNPROCESSABLE_ENTITY = HttpStatusCode.UNPROCESSABLE_ENTITY; // 422
export const ERROR_BAD_REQUEST = HttpStatusCode.BAD_REQUEST; // 400
export const ERROR_NOT_FOUND = HttpStatusCode.NOT_FOUND; // 404
export const ERROR_INTERNAL_SERVER_ERROR = HttpStatusCode.INTERNAL_SERVER_ERROR; // 500

export type TERROR_BAD_REQUEST = typeof ERROR_BAD_REQUEST;
export type TERROR_NOT_FOUND = typeof ERROR_NOT_FOUND;
export type TERROR_INTERNAL_SERVER_ERROR = typeof ERROR_INTERNAL_SERVER_ERROR;

// Error Status
export type DefaultResMessage = { message: string };
export type DefaultErrorBody = { status?: string; message: string; data?: any };

// AppError
export class AppError extends Error {
  status: string;
  data?: any;

  constructor(public statusCode: number = 500, public message: string, data?: any) {
    super(message);

    switch (statusCode) {
      case ERROR_UNAUTHORIZED:
        this.status = MESSAGES.error.unauthenticated;
        break;
      case ERROR_BAD_REQUEST:
        this.status = MESSAGES.error.functionIssue;
        break;
      case ERROR_NOT_FOUND:
        this.status = MESSAGES.error.notFound;
        break;
      case ERROR_INTERNAL_SERVER_ERROR:
        this.status = MESSAGES.error.internal;
        break;
      default:
        this.status = MESSAGES.error.unexpected;
    }

    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}
