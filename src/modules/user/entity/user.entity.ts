import {
  Column,
  Entity,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../role/entity/role.entity';
import { User as IUser } from '@personal/user-auth';
import { TaskList } from '../../tasklist/entity/tasklist.entity';
import { Note } from '../../note/entity/note.entity';

@Entity()
export class User extends IUser {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({
    nullable: true,
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({
    default: false,
    nullable: false,
  })
  publicActivity: boolean;

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

  // 1:M to Note (owner)
  @OneToMany(() => Note, (note) => note.user)
  notes: Note[];

  // 1:M to Note (as last modified by)
  @OneToMany(() => Note, (note) => note.lastModifiedUser)
  lastModifiedNotes: Note[];

  // 1:M to TaskList (owner)
  @OneToMany(() => TaskList, (tl) => tl.user)
  taskLists: TaskList[];

  // 1:M to TaskList (as last modified by)
  @OneToMany(() => TaskList, (tl) => tl.lastModifiedUser)
  lastModifiedTaskLists: TaskList[];
}
