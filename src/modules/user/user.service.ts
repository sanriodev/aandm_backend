import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RmqService } from '@personal/common';
import { IUserService, User } from '@personal/user-auth';
import { AuthService } from '@personal/user-auth/src/auth/auth.service';
import { TokenHandlingService } from '@personal/user-auth/src/auth/token-handling.service';
import { UserService } from '@personal/user-auth/src/service/user.service';
import { Repository } from 'typeorm';

@Injectable()
export class DBUserService extends UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly tokenService: TokenHandlingService,
  ) {
    super(this, authService, rmqService, tokenService);
  }
}
