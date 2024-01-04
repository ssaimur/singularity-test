import { Sequelize } from 'sequelize';
import { ADMIN_ROLE_ID, SUPERVISOR_ROLE_ID, commonExcludes } from '../constants/constants';
import { User, UserRole, UserShift } from '../models';
import { ICreateShift } from '../types/app.type';
import { Op } from 'sequelize';

export class AppService {
  public async getShifts() {
    return await UserShift.findAndCountAll({ attributes: { exclude: commonExcludes } });
  }

  public async addShift(shift: ICreateShift) {
    return await UserShift.create(shift as UserShift).then((res) => res.dataValues);
  }

  public async updateShift(shift: Partial<ICreateShift>, id: number) {
    return await UserShift.update(shift, { where: { id } });
  }

  public async deleteShift(id: number) {
    return await UserShift.destroy({ where: { id } });
  }

  public async getUsersByShift(shift_id: number) {
    return await User.findAndCountAll({
      attributes: { exclude: commonExcludes },
      include: {
        model: UserShift,
        attributes: [],
        where: { id: shift_id },
      },
    });
  }

  public async getUsersCountByShift() {
    return await User.findAll({
      attributes: [
        [Sequelize.col('shift.name'), 'shift_name'],
        [Sequelize.fn('COUNT', Sequelize.col('User.id')), 'users_count'],
      ],
      include: [
        {
          model: UserShift,
          attributes: [], // Exclude attributes from UserShift model
        },
        {
          model: UserRole,
          attributes: [],
          where: {
            id: { [Op.and]: [{ [Op.ne]: ADMIN_ROLE_ID }, { [Op.ne]: SUPERVISOR_ROLE_ID }] },
          },
        },
      ],
      group: ['shift.name'],
      raw: true,
    });
  }
}
