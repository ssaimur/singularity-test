import { Sequelize, Transaction } from 'sequelize';
import config from '../config/config';
import { User, UserRole, UserShift } from '../models';
import { UsersService } from '../services/user.service';
import jwt from 'jsonwebtoken';
import { commonExcludes } from '../constants/constants';
import { IResUser } from '../types/user.type';

export const responseWithResultToken = async (user: User, transaction: Transaction) => {
  const session = config.secrets.session;
  const expiresInMinutes = config.secrets.expiresInMinutes;
  const refreshExpiresInMinutes = config.secrets.refreshExpiresInMinutes;

  const userService = new UsersService();
  const accessToken = jwt.sign({ id: user.id, role_id: user.role_id }, session, {
    expiresIn: expiresInMinutes * 60,
  });
  const refreshToken = jwt.sign({ id: user.id + '_refresh', role_id: user.role_id }, session, {
    expiresIn: refreshExpiresInMinutes * 60,
  });
  // Update user
  await userService.update(
    {
      ...user,
      refreshToken,
    },
    {
      where: {
        id: user.id,
      },
      transaction,
    },
  );

  // Get updated user
  const _user = await User.findOne({
    where: {
      id: user.id,
    },
    attributes: {
      exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
      include: [[Sequelize.col('role.name'), 'role_name']],
    },
    include: [
      {
        model: UserRole,
        attributes: [],
      },
      {
        model: UserShift,
        attributes: { exclude: commonExcludes },
      },
    ],
    transaction,
  });

  return { accessToken: accessToken, userInfo: _user as unknown as IResUser, refreshToken: refreshToken };
};

export const getTokens = async (user_id: number) => {
  const session = config.secrets.session;
  const expiresInMinutes = config.secrets.expiresInMinutes;
  const refreshExpiresInMinutes = config.secrets.refreshExpiresInMinutes;

  const userService = new UsersService();
  const token = jwt.sign({ id: user_id }, session, {
    expiresIn: expiresInMinutes * 60,
  });

  const refreshToken = jwt.sign({ id: user_id + '_refresh' }, session, {
    expiresIn: refreshExpiresInMinutes * 60,
  });

  // Update user
  await userService.update(
    {
      refreshToken,
    },
    {
      where: {
        id: user_id,
      },
    },
  );

  return { token: token, refreshToken: refreshToken };
};
