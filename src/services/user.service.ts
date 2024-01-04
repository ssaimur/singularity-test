import { Attributes, CreationAttributes, FindOptions, FindOrCreateOptions, Sequelize, Transaction, UpdateOptions, WhereOptions } from 'sequelize';
import { User, UserRole, UserShift } from '../models';
import { Op } from 'sequelize';
import { IReqLogin, IResUser, ICreateUser } from '../types/user.type';
import { AppError, ERROR_BAD_REQUEST } from '../handles/errorTypes';
import { ADMIN_ROLE_ID, SUPERVISOR_ROLE_ID, commonExcludes } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import { IList } from '../types/common.type';

export class UsersService {
  public async createUser(input: User, transaction?: Transaction): Promise<User> {
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

  public async restoreById(id: number) {
    return await User.restore({ where: { id } });
  }

  public async deleteByIds(userIds: number[]) {
    return await User.destroy({ where: { id: { [Op.in]: userIds } } });
  }

  public async login({ password, userName }: IReqLogin, transaction: Transaction) {
    const user = await this.findUserByUserName(userName, transaction);

    if (user) {
      if (!(await User.compareValues(password, user.password))) {
        return null;
      }

      return user;
    }

    throw new AppError(ERROR_BAD_REQUEST, MESSAGES.loginFailed);
  }

  public async findAllUsersForAdmin(isRecycleBin?: boolean) {
    const where: WhereOptions = [Sequelize.where(Sequelize.col('User.deletedAt'), { [Op.not]: null })];

    const user = await User.findAndCountAll({
      ...(isRecycleBin && { where, paranoid: false }),
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [[Sequelize.col('role.name'), 'role_name']],
      },
      include: [
        {
          model: UserRole,
          attributes: [],
          where: {
            id: { [Op.ne]: ADMIN_ROLE_ID },
          },
        },
        {
          model: UserShift,
          attributes: { exclude: commonExcludes },
        },
      ],
    });

    return user as unknown as IList<IResUser>;
  }

  public async findAllUsersForSupervisor(isRecycleBin?: boolean) {
    const where: WhereOptions = [Sequelize.where(Sequelize.col('User.deletedAt'), { [Op.not]: null })];

    const user = await User.findAndCountAll({
      ...(isRecycleBin && { where, paranoid: false }),
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [[Sequelize.col('role.name'), 'role_name']],
      },
      include: [
        {
          model: UserRole,
          attributes: [],
          where: {
            id: { [Op.and]: [{ [Op.ne]: ADMIN_ROLE_ID }, { [Op.ne]: SUPERVISOR_ROLE_ID }] },
          },
        },
        {
          model: UserShift,
          attributes: { exclude: commonExcludes },
        },
      ],
    });

    return user as unknown as IList<IResUser>;
  }

  public async updateUser(req: Partial<ICreateUser>, user_id: number) {
    return await User.update(req, { where: { id: user_id } });
  }

  public async getUserWithDetails(user_id: number) {
    const user = await User.findByPk(user_id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'],
        include: [[Sequelize.col('role.name'), 'role_name']],
      },
      include: [
        {
          model: UserRole,
          attributes: [],
          where: {
            id: { [Op.ne]: ADMIN_ROLE_ID },
          },
        },
        {
          model: UserShift,
          attributes: { exclude: commonExcludes },
        },
      ],
    });

    return user as unknown as IResUser;
  }
}
