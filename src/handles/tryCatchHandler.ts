import { AppError, ERROR_INTERNAL_SERVER_ERROR } from './errorTypes';
import { handleUserUniqueness } from './userUniquenessHandle';

export default async function tryCatchHandler<T extends (...args: unknown[]) => unknown>(callback: T): Promise<ReturnType<T>> {
  try {
    return (await callback()) as ReturnType<T>;
  } catch (err: any) {
    console.log('Error detail: ', err);
    if (err instanceof AppError) {
      throw err;
    } else if (err.name === 'SequelizeUniqueConstraintError') {
      throw handleUserUniqueness(err);
    } else {
      throw new AppError(ERROR_INTERNAL_SERVER_ERROR, err.toString());
    }
  }
}
