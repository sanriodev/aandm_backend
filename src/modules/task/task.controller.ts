import {
  Get,
  Post,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Body,
  UnprocessableEntityException,
  Param,
  Delete,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JWTAuthGuard, PermissionsGuard, ReS } from '@personal/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';

@Controller('task')
@ApiTags('task')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class TaskController {
  constructor(
    @Inject(TaskService)
    private readonly taskListService: TaskService,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'create taskList',
    description: 'creates a new taskList',
  })
  @ApiBody({ type: CreateTaskDto })
  async createTaskList(@Body() inputs: CreateTaskDto): Promise<ReS<Task>> {
    try {
      return ReS.FromData(await this.taskListService.create(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get all taskLists',
    description: 'returns all taskLists',
  })
  async getTaskLists(): Promise<ReS<Task[]>> {
    return ReS.FromData(
      await this.taskListService.findMany({ relations: ['tasks'] }),
    );
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get a taskList',
    description: 'returns a taskList',
  })
  async getTaskList(@Param('id') id: number): Promise<ReS<Task>> {
    return ReS.FromData(await this.taskListService.findOne(id, []));
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'delete a taskList',
    description: 'deletes a taskList',
  })
  async deleteTaskList(@Param('id') id: number): Promise<ReS<Task>> {
    return ReS.FromData(await this.taskListService.delete(id));
  }
}
