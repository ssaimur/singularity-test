import { Attributes, CreationAttributes, FindOptions, FindOrCreateOptions, Transaction, UpdateOptions } from 'sequelize';
import { User } from '../models';
import { Op } from 'sequelize';
import { IReqLogin } from '../types/user.type';
import { AppError, ERROR_BAD_REQUEST } from '../handles/errorTypes';
import { commonExcludes } from '../constants/constants';
import { MESSAGES } from '../constants/messages';

export class UsersService {
  public async createUser(input: User, transaction: Transaction): Promise<User> {
    return await User.create(input, { transaction }).then((res) => res.dataValues);
  }

  public async findUserById(userId: number): Promise<User | null> {
    return await User.findByPk(userId);
  }

  public async findUsersByIds(userIds: number[]): Promise<User[]> {
    return await User.findAll({ where: { id: { [Op.in]: userIds } } });
  }

  public async findUserByUserName(userName: string, transaction?: Transaction) {
    return await User.findOne({
      where: { userName },
      attributes: { exclude: commonExcludes },
      transaction,
    });
  }

  public async findOne(options: FindOptions<User>) {
    return await User.findOne(options);
  }

  public async update(updated: any, query: UpdateOptions<User>) {
    return await User.update(updated, query);
  }

  public async findCreate(query: FindOrCreateOptions<Attributes<User>, CreationAttributes<User>>) {
    return await User.findCreateFind(query);
  }

  public async deleteById(id: number) {
    return await User.destroy({ where: { id } });
  }

  public async deleteByIds(userIds: number[]) {
    return await User.destroy({ where: { id: { [Op.in]: userIds } } });
  }

  public async login({ password, userName }: IReqLogin) {
    const user = await this.findUserByUserName(userName);

    if (user) {
      if (!(await User.compareValues(password, user.password))) {
        return null;
      }

      return user;
    }

    throw new AppError(ERROR_BAD_REQUEST, MESSAGES.loginFailed);
  }
}
