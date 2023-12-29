import { AppError, ERROR_INTERNAL_SERVER_ERROR } from './errorTypes';

export default async function tryCatchHandler<T extends (...args: unknown[]) => unknown>(callback: T): Promise<ReturnType<T>> {
  try {
    return (await callback()) as ReturnType<T>;
  } catch (err: any) {
    console.log('Error detail: ', err);
    if (err instanceof AppError) throw err;
    throw new AppError(ERROR_INTERNAL_SERVER_ERROR, err.toString());
  }
}
