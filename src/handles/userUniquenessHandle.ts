import { EUserUniqueFields } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import { AppError, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR } from './errorTypes';

export const handleUserUniqueness = (err: any) => {
  if (err.errors[0].type === 'unique violation') {
    const path = err.errors[0].path;

    if (path === EUserUniqueFields.email) {
      return new AppError(ERROR_BAD_REQUEST, MESSAGES.user.emailExists);
    }

    if (path === EUserUniqueFields.phoneNumber) {
      return new AppError(ERROR_BAD_REQUEST, MESSAGES.user.phoneNumberExists);
    }

    if (path === EUserUniqueFields.userName) {
      return new AppError(ERROR_BAD_REQUEST, MESSAGES.user.userNameExists);
    }
  }

  return new AppError(ERROR_INTERNAL_SERVER_ERROR, err.toString());
};
