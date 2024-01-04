import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import config from './config/config';
import { AppError, ERROR_UNAUTHORIZED } from './handles/errorTypes';
import { MESSAGES } from './constants/messages';

export function expressAuthentication(request: express.Request, securityName: string, _scopes?: string[]): Promise<any> {
  if (securityName === 'Auth') {
    let access_token = '';

    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer')) {
      access_token = request.headers.authorization.split(' ')[1];
    } else if (request.cookies.access_token) {
      access_token = request.cookies.access_token;
    }

    return new Promise((resolve, reject) => {
      if (!access_token) {
        reject(new AppError(ERROR_UNAUTHORIZED, MESSAGES.auth.unauthenticated.emptyToken));
      }

      jwt.verify(access_token, config.secrets.session, function (err: any, decoded: any) {
        if (err) {
          if (err.expiredAt || err.date) {
            reject(new AppError(ERROR_UNAUTHORIZED, MESSAGES.auth.unauthenticated.expiredToken));
          } else {
            reject(new AppError(ERROR_UNAUTHORIZED, MESSAGES.auth.unauthenticated.invalidToken));
          }
        } else {
          const expTime = decoded.exp * 1000;
          const isExpired = expTime < new Date().getTime();

          if (isExpired) {
            reject(new AppError(ERROR_UNAUTHORIZED, MESSAGES.auth.unauthenticated.expiredToken));
          }

          resolve(decoded);
        }
      });
    });
  }

  return new Promise((resolve) => resolve({ data: false }));
}
