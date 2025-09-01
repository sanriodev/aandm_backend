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
  ForbiddenException,
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
  JWTPayload,
  Permissions,
  PermissionsGuard,
  ReS,
  UserFromRequest,
} from '@personal/common';
import { Note } from './entity/note.entity';
import { NoteService } from './note.service';
import { Privacy } from '../common/enum/privacy.enum';
import { In } from 'typeorm';

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
  async createOrUpdate(
    @Body() inputs: CreateNoteDto,
    @UserFromRequest() user: JWTPayload,
  ): Promise<ReS<Note>> {
    try {
      if (!user.user.id) {
        throw new ForbiddenException('unauthenticated');
      }
      const dto = {
        ...inputs,
        userId: user.user.id,
        lastModifiedUserId: user.user.id,
      };
      return ReS.FromData(await this.noteService.create(dto));
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
  async getNotes(@UserFromRequest() user: JWTPayload): Promise<ReS<Note[]>> {
    if (!user.user.id) {
      throw new ForbiddenException('unauthenticated');
    }
    return ReS.FromData(
      await this.noteService.findMany({
        where: [
          { userId: user.user.id },
          { privacyMode: In([Privacy.Public, Privacy.Protected]) },
        ],
      }),
    );
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
    return ReS.FromData(await this.noteService.findOne({ where: { id } }));
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
