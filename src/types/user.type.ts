import { IUser } from '../models/user.model';

export type TWeekDays = 'saturday' | 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface IReqRegisterUser {
  userName: string;
  password: string;
  role_id: number;
  phoneNumber: string;
  email?: string;
  fullName: string;
}

export interface IResRegister {
  token: string;
  userInfo: IUser;
  refreshToken: string;
}

export interface IReqLogin {
  userName: string;
  password: string;
}
