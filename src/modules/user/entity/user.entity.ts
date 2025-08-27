import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../role/entity/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: false })
  firstName: string;

  @Column({ nullable: false, unique: false })
  lastName: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ default: 'active' })
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

  permissions: string[];

  @Column({
    nullable: false,
    default: [],
    length: 2048,
  })
  refreshTokens: string[];

  @Column({
    nullable: false,
    default: [],
    length: 2048,
  })
  appTokens: string[];

  navPermissions: string;

  @OneToMany(() => Role, (role) => role.users)
  roles: Role[];
}
