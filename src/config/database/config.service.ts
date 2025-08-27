import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ISqlConfig } from './config.interface';

/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class SqlConfigService {
  constructor(private configService: ConfigService) {}

  get LoadedConfig(): ISqlConfig {
    return this.configService.get<ISqlConfig>('sql');
  }

  get TypeOrmModuleOptions(): TypeOrmModuleOptions {
    return {
      ...this.LoadedConfig,
      autoLoadEntities: true,
    } as TypeOrmModuleOptions;
  }
}
