import {
  Controller,
  Inject,
  Post,
  Request,
  UnprocessableEntityException,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Audit,
  AuditLogLevel,
  JWTAuthGuard,
  ReE,
  ResponseSanitizer,
} from '@personal/common';
import { AuthService } from '@personal/user-auth/src/auth/auth.service';
import { LogoutResponseDto } from '@personal/user-auth/src/controller/v1/dto/logout-response.dto';
import { DBUserService } from '../../../user/user.service';

@Controller('auth')
@ApiTags('Authentication')
@Audit({
  namespace: 'auth',
})
@ApiResponse({ status: 403, description: 'Forbidden.' })
@ApiResponse({ status: 400, description: 'Bad input params', type: ReE })
@ApiResponse({ status: 401, description: 'Unauthorized', type: ReE })
@ApiResponse({ status: 404, description: 'Not found.', type: ReE })
export class AandMAuthController {
  constructor(
    @Inject(AuthService) protected readonly authService: AuthService,
    @Inject(DBUserService) protected readonly userService: DBUserService,
  ) {}
  // Logout override for project
  @Post('logout')
  @Version('1')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @Audit({
    action: 'logout',
    logLevel: AuditLogLevel.ALL,
  })
  @ApiOperation({
    summary: 'Logout and invalidate all refresh_tokens for a user',
    description:
      'This endpoint can be used to clear all `refresh_tokens` from an user (i.e. logout from all devices).<br/>If this one is called, then the client app has to make sure to clear all userdata locally as well.',
  })
  @UseInterceptors(ResponseSanitizer)
  async logout(@Request() req): Promise<LogoutResponseDto> {
    try {
      return await this.userService.logout(req.user.user ?? req.user);
    } catch (e) {
      throw new UnprocessableEntityException(e.message);
    }
  }
}
