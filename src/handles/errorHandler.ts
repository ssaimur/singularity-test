import { NextFunction, Request as ExRequest, Response as ExResponse } from 'express';
import { ValidateError } from 'tsoa';

import { encryptLogString } from './logEncryptHelper';
import { AppError, ERROR_INTERNAL_SERVER_ERROR, ERROR_UNPROCESSABLE_ENTITY } from './errorTypes';
import { MESSAGES } from '../constants/messages';

/**
 * Error Handler for app
 * @param {*} error
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const errorHandler = (error: AppError, req: ExRequest, res: ExResponse, next: NextFunction) => {
  if (error instanceof ValidateError) {
    console.warn(ERROR_UNPROCESSABLE_ENTITY, `Validation Issues: ${req.method} ${req.originalUrl} -> ${JSON.stringify(getEntryptBody(req.body))}`);
    console.warn(`=> `, error.fields);

    return res.status(ERROR_UNPROCESSABLE_ENTITY).json({
      message: 'Validation Failed',
      details: error?.fields,
    });
  }

  error.statusCode = error.statusCode || ERROR_INTERNAL_SERVER_ERROR;

  console.warn(error.statusCode, `${req.method} ${req.originalUrl} -> ${JSON.stringify(getEntryptBody(req.body))}`);
  console.warn(`=> ${error.message}`);

  const message = error.statusCode === ERROR_INTERNAL_SERVER_ERROR ? MESSAGES.unexpected : error.message;

  res.status(error.statusCode).json({
    status: error.status,
    message: message,
    ...(typeof error.data !== 'undefined' ? { data: error.data } : {}),
  });

  next();
};

const getEntryptBody = (reqBody: any) => {
  const body = { ...reqBody };
  if (body.phoneNumber) {
    body.phoneNumber = encryptLogString(body.phoneNumber);
  }

  if (body.password) {
    body.password = encryptLogString(body.password);
  }

  return body;
};
