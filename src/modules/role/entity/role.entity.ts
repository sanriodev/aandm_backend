import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    nullable: false,
    unique: true,
  })
  roleName: string;

  @Column({
    type: 'text',
    array: true,
    nullable: false,
    default: () => 'ARRAY[]::text[]',
  })
  accessPermissions: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: false,
    default: () => 'ARRAY[]::text[]',
  })
  navPermissions: string[];

  @Column({
    type: 'text',
    array: true,
    nullable: false,
    default: () => 'ARRAY[]::text[]',
  })
  appPermissions: string[];

  // ------------------- ASSOCIATIONS --------------------

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
