import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskListModule } from '../tasklist/tasklist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TaskListModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
