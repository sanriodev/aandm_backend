import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { TaskList } from '../entity/tasklist.entity';
import { Privacy } from '../../common/enum/privacy.enum';

export class UpdateTaskListDto extends OmitType(TaskList, [
  'lastModifiedUserId',
  'userId',
  'privacyMode',
]) {
  @ApiProperty({
    example: '1',
    description: 'The id of the tasklist',
    required: true,
  })
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    example: 'Personal Tasks',
    description: 'The name of the tasklist',
    required: true,
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'public',
    description: 'The privacy mode of the tasklist',
  })
  @IsOptional()
  privacyMode: Privacy;
}
