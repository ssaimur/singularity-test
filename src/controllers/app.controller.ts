import { Controller, Route, Tags, Response, Get, Security, Post, Body, Patch, Path, Delete } from 'tsoa';
import { AppError, DefaultErrorBody, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR, ERROR_NOT_FOUND } from '../handles/errorTypes';
import tryCatchHandler from '../handles/tryCatchHandler';
import { AppService } from '../services/app.service';
import { IUserShift } from '../models/user_shift.model';
import { ICreateShift } from '../types/app.type';
import { IList } from '../types/common.type';
import { IUser } from '../models/user.model';
import { MESSAGES } from '../constants/messages';

@Tags('App')
@Route('apps')
@Response<DefaultErrorBody>(ERROR_INTERNAL_SERVER_ERROR, 'Interal Server Error')
@Response<DefaultErrorBody>(ERROR_BAD_REQUEST, 'Bad Request')
@Response<DefaultErrorBody>(ERROR_NOT_FOUND, 'Not Found')
export class AppController extends Controller {
  private appService = new AppService();

  @Security('Auth')
  @Get('shifts')
  public async getUsersForAdmin(): Promise<IList<IUserShift>> {
    return tryCatchHandler(async () => {
      return await this.appService.getShifts();
    });
  }

  @Security('Auth')
  @Get('shifts/{id}/users')
  public async getUsersByShift(@Path() id: number): Promise<IList<IUser>> {
    return tryCatchHandler(async () => {
      return await this.appService.getUsersByShift(id);
    });
  }

  // @Security('Auth')
  @Get('shifts/users/count')
  public async getUsersCountByShift(): Promise<IUser[]> {
    return tryCatchHandler(async () => {
      return await this.appService.getUsersCountByShift();
    });
  }

  @Security('Auth')
  @Post('shifts')
  public async createShifts(@Body() body: ICreateShift): Promise<IUserShift | void> {
    return tryCatchHandler(async () => {
      return await this.appService.addShift(body);
    });
  }

  @Security('Auth')
  @Patch('shifts/{id}')
  public async updateShift(@Path() id: number, @Body() body: Partial<ICreateShift>): Promise<void> {
    return tryCatchHandler(async () => {
      await this.appService.updateShift(body, id);
    });
  }

  @Security('Auth')
  @Delete('shifts/{id}')
  public async deleteShift(@Path() id: number): Promise<void> {
    return tryCatchHandler(async () => {
      const { count } = await this.appService.getUsersByShift(id);
      if (count) {
        throw new AppError(ERROR_BAD_REQUEST, MESSAGES.shift.userExists);
      }
      await this.appService.deleteShift(id);
    });
  }
}
