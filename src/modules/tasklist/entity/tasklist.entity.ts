import { Privacy } from '../../common/enum/privacy.enum';
import { Note } from '../../note/entity/note.entity';
import { Task } from '../../task/entity/task.entity';
import { User } from '../../user/entity/user.entity';
import { ITaskList } from '../interface/tasklist.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TaskList implements ITaskList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({ nullable: false, default: Privacy.Private, enum: Privacy })
  privacyMode: Privacy;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.taskList)
  tasks: Task[];

  @ManyToOne(() => User, (user) => user.notes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @Column({ nullable: false })
  userId: string;

  // M:1 to User (last modified by)
  @ManyToOne(() => User, (user) => user.lastModifiedNotes, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'lastModifiedUserId', referencedColumnName: 'id' })
  lastModifiedUser: User;

  @Column({ nullable: false })
  lastModifiedUserId: string;
}
