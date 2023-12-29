import * as jwt from 'jsonwebtoken';
import { AppError, ERROR_UNAUTHENTICATION } from '../handles/errorTypes';
import { MESSAGES } from '../constants/messages';
import config from '../config/config';

export const validateToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject(new AppError(ERROR_UNAUTHENTICATION, MESSAGES.auth.unauthenticated.emptyToken));
    }

    jwt.verify(token, config.secrets.session, function (err: any, decoded: any) {
      if (err) {
        if (err.expiredAt || err.date) {
          reject(new AppError(ERROR_UNAUTHENTICATION, MESSAGES.auth.unauthenticated.expiredToken));
        } else {
          reject(new AppError(ERROR_UNAUTHENTICATION, MESSAGES.auth.unauthenticated.invalidToken));
        }
      } else {
        const expTime = decoded.exp * 1000;
        const isExpired = expTime < new Date().getTime();

        if (isExpired) {
          reject(new AppError(ERROR_UNAUTHENTICATION, MESSAGES.auth.unauthenticated.expiredToken));
        }

        resolve(decoded);
      }
    });
  });
};
