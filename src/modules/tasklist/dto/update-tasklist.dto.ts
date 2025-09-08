import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { TaskList } from '../entity/tasklist.entity';

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
  @IsNotEmpty()
  name: string;
}
