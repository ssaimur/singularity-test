import { Controller, Post, Route, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { AppError, DefaultErrorBody, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR, ERROR_NOT_FOUND, SUCCESS } from '../handles/errorTypes';
import tryCatchHandler from '../handles/tryCatchHandler';
import { IReqLogin, IReqRegisterUser, IResLogin } from '../types/user.type';
import { UsersService } from '../services/user.service';
import sequelize from '../config/dataSource';
import { User } from '../models';
import { responseWithResultToken } from '../helpers/tokenHelper';
import { MESSAGES } from '../constants/messages';

@Tags('Auth')
@Route('auth')
@Response<DefaultErrorBody>(ERROR_INTERNAL_SERVER_ERROR, 'Interal Server Error')
@Response<DefaultErrorBody>(ERROR_BAD_REQUEST, 'Bad Request')
@Response<DefaultErrorBody>(ERROR_NOT_FOUND, 'Not Found')
export class AuthController extends Controller {
  private userService = new UsersService();

  @SuccessResponse(SUCCESS, 'Registered')
  @Post('register')
  public async registerUser(@Body() reqBody: IReqRegisterUser): Promise<IResLogin> {
    return tryCatchHandler(async () => {
      return await sequelize.transaction(async (transaction) => {
        const createdUser = await this.userService.createUser(reqBody as User, transaction);

        return responseWithResultToken(createdUser, transaction);
      });
    });
  }

  @SuccessResponse(SUCCESS, 'Logged in')
  @Post('login')
  public async login(@Body() reqBody: IReqLogin): Promise<IResLogin> {
    return tryCatchHandler(async () => {
      return await sequelize.transaction(async (transaction) => {
        const user = await this.userService.login(reqBody, transaction);

        if (!user) {
          throw new AppError(ERROR_BAD_REQUEST, MESSAGES.loginFailed);
        }

        return responseWithResultToken(user, transaction);
      });
    });
  }
}
