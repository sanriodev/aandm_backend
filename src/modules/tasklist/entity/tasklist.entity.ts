import { Privacy } from '../../common/enum/privacy.enum';
import { Task } from '../../task/entity/task.entity';
import { ITaskList } from '../interface/tasklist.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: false, default: Privacy.Private })
  privacyMode: Privacy;

  @Column({ nullable: false })
  lastModifiedUserId: string;

  @Column({
    nullable: false,
  })
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.taskList)
  tasks: Task[];
}
