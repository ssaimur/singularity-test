import { Table, Column, DataType, Model, PrimaryKey, AutoIncrement, AllowNull, CreatedAt, UpdatedAt, DeletedAt, HasMany } from 'sequelize-typescript';
import User from './user.model';

@Table({
  tableName: 'user_roles',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})
export default class UserRole extends Model<UserRole> implements UserRole {
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

  /**
   * associations
   */
  @HasMany(() => User, 'role_id')
  users: User[];
}

export type IUserRole = InstanceType<typeof UserRole>;
