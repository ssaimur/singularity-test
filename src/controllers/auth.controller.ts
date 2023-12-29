import { Controller, Post, Route, SuccessResponse, Tags, Response, Body } from 'tsoa';
import { DefaultErrorBody, ERROR_BAD_REQUEST, ERROR_INTERNAL_SERVER_ERROR, ERROR_NOT_FOUND, SUCCESSE } from '../handles/errorTypes';
// import config from '../config/config';
// import { sendOtp } from '../common/helpers/mailersendHelper';
import tryCatchHandler from '../handles/tryCatchHandler';
import { IReqRegisterUser, IResRegister } from '../types/user.type';
import { UsersService } from '../services/user.service';
import sequelize from '../config/dataSource';
import { User } from '../models';
import { responseWithResultToken } from '../helpers/tokenHelper';

// const expiredSeconds: any = config.otp.expiredSeconds;
// const getNewOtpExpiredTime = () => new Date(new Date().getTime() + 1000 * expiredSeconds);

@Tags('Auth')
@Route('auth')
@Response<DefaultErrorBody>(ERROR_INTERNAL_SERVER_ERROR, 'Interal Server Error')
@Response<DefaultErrorBody>(ERROR_BAD_REQUEST, 'Bad Request')
@Response<DefaultErrorBody>(ERROR_NOT_FOUND, 'Not Found')
export class AuthController extends Controller {
  @SuccessResponse(SUCCESSE, 'Registered')
  @Post('register')
  public async registerUser(@Body() reqBody: IReqRegisterUser): Promise<IResRegister> {
    const userService = new UsersService();
    return tryCatchHandler(async () => {
      return await sequelize.transaction(async (transaction) => {
        const createdUser = await userService.createUser(reqBody as User, transaction);

        return responseWithResultToken(createdUser, transaction);
      });
    });
  }
}
