import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
    length: 2048,
    nullable: false,
    default: '[]',
  })
  accessPermissions: string[];

  @Column({
    length: 2048,
    nullable: false,
    default: '[]',
  })
  navPermissions: string[];

  appPermissions: string[];

  // ------------------- ASSOCIATIONS --------------------

  @OneToMany(() => User, (user) => user.roles)
  users: User[];
}
