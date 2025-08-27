import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DBUserService } from './user.service';
import { AuthService } from '@personal/user-auth/src/auth/auth.service';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: DBUserService,
    private readonly authService: AuthService,
  ) {}
}
