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
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JWTAuthGuard, PermissionsGuard, ReS } from '@personal/common';
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
  @ApiOperation({
    summary: 'create note',
    description: 'creates a new note',
  })
  @ApiBody({ type: CreateNoteDto })
  async createOrUpdate(@Body() inputs: CreateNoteDto): Promise<ReS<Note>> {
    try {
      return ReS.FromData(await this.noteService.create(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
  @Get('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get all notes',
    description: 'returns all notes',
  })
  async getNotes(): Promise<ReS<Note[]>> {
    return ReS.FromData(await this.noteService.findMany({}));
  }

  @Get('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'get a note',
    description: 'returns a note',
  })
  async getNote(@Param('id') id: number): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.findOne(id, []));
  }

  @Put('/')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'update note',
    description: 'updates a note',
  })
  async updateNote(@Body() dto: UpdateNoteDto): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.update(dto));
  }

  @Delete('/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'delete note',
    description: 'deletes a note',
  })
  async deleteNote(@Param('id') id: number): Promise<ReS<Note>> {
    return ReS.FromData(await this.noteService.delete(id));
  }
}
