import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskList } from './entity/tasklist.entity';
import { TaskListController } from './tasklist.controller';
import { TaskListService } from './tasklist.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskList])],
  controllers: [TaskListController],
  providers: [TaskListService],
  exports: [TaskListService],
})
export class TaskListModule {}
