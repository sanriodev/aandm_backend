import {
  Post,
  Controller,
  ValidationPipe,
  UsePipes,
  Inject,
  Body,
  UnprocessableEntityException,
  Version,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ReS } from '@personal/common';
import { RequestAccessDto } from './dto/request-access.dto';
import { ApplicationService } from './application-service';

@Controller('application')
@ApiTags('application')
@ApiExtraModels(ReS)
export class ApplicationController {
  constructor(
    @Inject(ApplicationService)
    private readonly applicationService: ApplicationService,
  ) {}

  @Post('/request-access')
  @Version('1')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'request access',
    description: 'request a User to access the application',
  })
  @ApiBody({ type: RequestAccessDto })
  async requesstAccess(@Body() inputs: RequestAccessDto): Promise<ReS<void>> {
    try {
      return ReS.FromData(await this.applicationService.requestAccess(inputs));
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
