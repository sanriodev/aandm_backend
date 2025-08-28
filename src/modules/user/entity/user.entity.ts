import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../role/entity/role.entity';
import { User as IUser } from '@personal/user-auth';

@Entity()
export class User extends IUser {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: false })
  firstName: string;

  @Column({ nullable: false, unique: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false, default: 'active' })
  status: string;

  @Column({
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({})
  password: string;

  @Column()
  salt: string;

  @Column({
    type: 'text',
    array: true,
    nullable: false,
    default: () => 'ARRAY[]::text[]',
  })
  refreshTokens: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: false,
    default: () => 'ARRAY[]::text[]',
  })
  appTokens: string[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_roles_role',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
