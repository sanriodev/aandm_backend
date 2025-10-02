import {
  Get,
  Post,
  Controller,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Inject,
  Body,
  UnprocessableEntityException,
  Param,
  Delete,
  Version,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  JWTAuthGuard,
  Permissions,
  PermissionsGuard,
  ReS,
} from '@personal/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
@ApiTags('task')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class TaskController {
  constructor(
    @Inject(TaskService)
    private readonly taskService: TaskService,
  ) {}

  @Post('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:create')
  @ApiOperation({
    summary: 'create a task',
    description: 'creates a new task',
  })
  async createTask(@Body() inputs: CreateTaskDto): Promise<ReS<Task>> {
    try {
      return ReS.FromData(await this.taskService.create(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:get:all')
  @ApiOperation({
    summary: 'get all tasks',
    description: 'returns all tasks',
  })
  async getTasks(): Promise<ReS<Task[]>> {
    return ReS.FromData(
      await this.taskService.findMany({
        relations: ['taskList'],
        order: { id: 'DESC' },
      }),
    );
  }

  @Get('/list/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:get:all')
  @ApiOperation({
    summary: 'get all tasks',
    description: 'returns all tasks',
  })
  async getTasksForList(@Param('id') id: number): Promise<ReS<Task[]>> {
    return ReS.FromData(
      await this.taskService.findMany({
        where: { taskList: { id: id } },
        relations: ['taskList'],
        order: { id: 'DESC' },
      }),
    );
  }

  @Get('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:get')
  @ApiOperation({
    summary: 'get a task',
    description: 'returns a task',
  })
  async getTaskList(@Param('id') id: number): Promise<ReS<Task>> {
    return ReS.FromData(
      await this.taskService.findOne({
        where: { id },
        relations: ['taskList'],
      }),
    );
  }

  @Put('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:update')
  @ApiOperation({
    summary: 'update a task',
    description: 'updates a task',
  })
  async updateTask(@Body() inputs: UpdateTaskDto): Promise<ReS<Task>> {
    return ReS.FromData(await this.taskService.update(inputs));
  }

  @Delete('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task:delete')
  @ApiOperation({
    summary: 'delete a task',
    description: 'deletes a task',
  })
  async deleteTaskList(@Param('id') id: number): Promise<ReS<Task>> {
    return ReS.FromData(await this.taskService.delete(id));
  }
}
