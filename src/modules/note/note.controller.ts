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
  Put,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import {
  JWTAuthGuard,
  Permissions,
  PermissionsGuard,
  ReS,
} from '@personal/common';
import { Note } from './entity/note.entity';
import { NoteService } from './note.service';

@Controller('note')
@ApiTags('note')
@UseGuards(PermissionsGuard)
@UseGuards(JWTAuthGuard)
@ApiExtraModels(ReS)
@ApiResponse({ status: 403, description: 'Forbidden.' })
export class NoteController {
  constructor(
    @Inject(NoteService)
    private readonly noteService: NoteService,
  ) {}

  @Post('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('note:create')
  @ApiOperation({
    summary: 'create a note',
    description: 'creates a new note',
  })
  async createOrUpdate(@Body() inputs: CreateNoteDto): Promise<ReS<Note>> {
    try {
      return ReS.FromData(await this.noteService.create(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  @Get('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('note:get:all')
  @ApiOperation({
    summary: 'get all notes',
    description: 'returns all notes',
  })
  async getNotes(): Promise<ReS<Note[]>> {
    return ReS.FromData(await this.noteService.findMany({}));
  }

  @Get('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('note:get')
  @ApiOperation({
    summary: 'get a note',
    description: 'returns a note',
  })
  async getNote(@Param('id') id: number): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.findOne(id, []));
  }

  @Put('/')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('note:update')
  @ApiOperation({
    summary: 'update a note',
    description: 'updates a note',
  })
  async updateNote(@Body() dto: UpdateNoteDto): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.update(dto));
  }

  @Delete('/:id')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Permissions('note:delete')
  @ApiOperation({
    summary: 'delete a note',
    description: 'deletes a note',
  })
  async deleteNote(@Param('id') id: number): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.delete(id));
  }
}
