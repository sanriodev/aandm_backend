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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTaskListDto } from './dto/create-tasklist.dto';
import {
  JWTAuthGuard,
  Permissions,
  PermissionsGuard,
  ReS,
} from '@personal/common';
import { TaskList } from './entity/tasklist.entity';
import { TaskListService } from './tasklist.service';

@Controller('task-list')
@ApiTags('task-list')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class TaskListController {
  constructor(
    @Inject(TaskListService)
    private readonly taskListService: TaskListService,
  ) {}

  @Post('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:create')
  @ApiOperation({
    summary: 'create',
    description: 'create a new task-list',
  })
  @ApiBody({ type: CreateTaskListDto })
  async createTaskList(
    @Body() inputs: CreateTaskListDto,
  ): Promise<ReS<TaskList>> {
    try {
      return ReS.FromData(await this.taskListService.create(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }

  @Get('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:get:all')
  @ApiOperation({
    summary: 'get all',
    description: 'get all task-lists',
  })
  async getTaskLists(): Promise<ReS<TaskList[]>> {
    return ReS.FromData(
      await this.taskListService.findMany({ relations: ['tasks'] }),
    );
  }

  @Get('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:get')
  @ApiOperation({
    summary: 'get a task-list',
    description: 'returns a task-list',
  })
  async getTaskList(@Param('id') id: number): Promise<ReS<TaskList>> {
    return ReS.FromData(await this.taskListService.findOne(id, []));
  }

  @Delete('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('task-list:delete')
  @ApiOperation({
    summary: 'delete a task-list',
    description: 'deletes a task-list',
  })
  async deleteTaskList(@Param('id') id: number): Promise<ReS<TaskList>> {
    return ReS.FromData(await this.taskListService.delete(id));
  }
}
