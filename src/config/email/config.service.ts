import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailConfig } from './config.interface';

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class EmailConfigService {
  constructor(private configService: ConfigService) {}

  get LoadedConfig(): IEmailConfig {
    return this.configService.get<IEmailConfig>('email');
  }
}
