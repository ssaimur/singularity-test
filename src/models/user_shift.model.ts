import { Table, Column, DataType, Model, PrimaryKey, AutoIncrement, AllowNull, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import User from './user.model';

@Table({
  tableName: 'user_shifts',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
export default class UserShift extends Model<UserShift> implements UserShift {
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
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  start_at: string;

  @AllowNull(false)
  @Column(DataType.TIME)
  end_at: string;

  /**
   * associations
   */
  @HasMany(() => User, 'shift_id')
  users: User[];
}

export type IUserShift = InstanceType<typeof UserShift>;
