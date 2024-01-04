import {
  Table,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  AutoIncrement,
  BeforeSave,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import UserRole from './user_role.model';
import UserShift from './user_shift.model';
import { WEEK_DAYS } from '../constants/constants';
import { TWeekDays } from '../types/user.type';

const salt = 12;

@Table({
  tableName: 'users',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
export default class User extends Model<User> implements User {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @CreatedAt
  @Column
  createdAt: Date;

  @UpdatedAt
  @Column
  updatedAt?: Date;

  @DeletedAt
  @Column
  deletedAt?: Date;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  userName: string;

  @Column(DataType.STRING)
  password: string;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  @ForeignKey(() => UserRole)
  role_id: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    unique: true,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email?: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  fullName: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  avatarUri?: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  is_active: boolean;

  @AllowNull(true)
  @ForeignKey(() => UserShift)
  @Column(DataType.INTEGER)
  shift_id?: number;

  @AllowNull(true)
  @Column(DataType.ENUM(...WEEK_DAYS))
  weekday_start?: TWeekDays;

  @AllowNull(true)
  @Column(DataType.ENUM(...WEEK_DAYS))
  weekday_end?: TWeekDays;

  @BeforeSave
  static async hashPassword(user: User) {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  static async compareValues(candidate: string, hashed: string) {
    return await bcrypt.compare(candidate, hashed);
  }

  static async getHashed(value: string) {
    return await bcrypt.hash(value, salt);
  }

  /**
   * associations
   */
  @BelongsTo(() => UserRole, 'role_id')
  role: UserRole;

  @BelongsTo(() => UserShift, 'shift_id')
  shift: UserShift;
}

export type IUser = InstanceType<typeof User>;
