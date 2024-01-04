import { Controller, Route, SuccessResponse, Tags, Response, Get, Patch, Path, Body, Delete, Query, Security, Post } from 'tsoa';
import { AppError, DefaultErrorBody, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR, ERROR_NOT_FOUND, SUCCESS } from '../handles/errorTypes';
import tryCatchHandler from '../handles/tryCatchHandler';
import { IResUser, ICreateUser } from '../types/user.type';
import { UsersService } from '../services/user.service';
import { IList } from '../types/common.type';
import { MESSAGES } from '../constants/messages';
import { User } from '../models';
import { IUser } from '../models/user.model';

@Tags('User')
@Route('users')
@Response<DefaultErrorBody>(ERROR_INTERNAL_SERVER_ERROR, 'Interal Server Error')
@Response<DefaultErrorBody>(ERROR_BAD_REQUEST, 'Bad Request')
@Response<DefaultErrorBody>(ERROR_NOT_FOUND, 'Not Found')
export class UserController extends Controller {
  private userService = new UsersService();

  @Security('Auth')
  @Post('')
  public async createUser(@Body() body: ICreateUser): Promise<IUser | void> {
    return tryCatchHandler(async () => {
      return await this.userService.createUser(body as User);
    });
  }

  @Security('Auth')
  @Get('for-admin')
  public async getUsersForAdmin(@Query() recycleBin?: 'true'): Promise<IList<IResUser>> {
    return tryCatchHandler(async () => {
      const isRecycleBin = recycleBin === 'true';
      return await this.userService.findAllUsersForAdmin(isRecycleBin);
    });
  }

  @Security('Auth')
  @Get('for-supervisor')
  public async getUsersForSuperVisor(@Query() recycleBin?: 'true'): Promise<IList<IResUser>> {
    return tryCatchHandler(async () => {
      const isRecycleBin = recycleBin === 'true';
      return await this.userService.findAllUsersForSupervisor(isRecycleBin);
    });
  }

  @Security('Auth')
  @SuccessResponse(SUCCESS, 'Updated user')
  @Get('{id}')
  public async getUser(@Path() id: number): Promise<IResUser | void> {
    return tryCatchHandler(async () => {
      const user = await this.userService.getUserWithDetails(id);

      if (!user) {
        throw new AppError(ERROR_BAD_REQUEST, MESSAGES.user.doesNotExists);
      }

      return user;
    });
  }

  @Security('Auth')
  @SuccessResponse(SUCCESS, 'Updated user')
  @Patch('{id}')
  public async updateUser(@Path() id: number, @Body() req: Partial<ICreateUser>): Promise<void> {
    return tryCatchHandler(async () => {
      const updatedUser = req;

      if (req.password) {
        const hashedPassword = await User.getHashed(req.password);
        updatedUser.password = hashedPassword;
      }

      const [affectedCount] = await this.userService.updateUser(updatedUser, id);

      if (!affectedCount) {
        throw new AppError(ERROR_BAD_REQUEST, MESSAGES.user.doesNotExists);
      }
    });
  }

  @Security('Auth')
  @SuccessResponse(SUCCESS, 'Deleted user')
  @Delete('{id}')
  public async deleteUser(@Path() id: number): Promise<void> {
    return tryCatchHandler(async () => {
      const affectedCount = await this.userService.deleteById(id);

      if (!affectedCount) {
        throw new AppError(ERROR_BAD_REQUEST, MESSAGES.user.doesNotExists);
      }
    });
  }

  @Security('Auth')
  @SuccessResponse(SUCCESS, 'Deleted user')
  @Patch('{id}/restore')
  public async restoreUser(@Path() id: number): Promise<void> {
    return tryCatchHandler(async () => {
      await this.userService.restoreById(id);
    });
  }
}
