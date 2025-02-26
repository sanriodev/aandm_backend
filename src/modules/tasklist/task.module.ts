import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskList, TaskListSchema } from './schema/tasklist.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TaskList.name,
        schema: TaskListSchema,
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
