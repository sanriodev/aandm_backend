import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { SqlConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseConfigModule } from '@personal/common/dist/config-util/base-module/base-config.module';
import { JoiUtil } from '@personal/common';
import { ISqlConfig } from './config.interface';
import dbconn from './dbconn';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    BaseConfigModule,
    ConfigModule.forFeature(
      JoiUtil.validateAndRegister<ISqlConfig>('sql', {
        database: {
          joi: Joi.string().required(),
          value: dbconn.database,
        },
        host: {
          joi: Joi.string().required(),
          value: dbconn.host,
        },
        password: {
          joi: Joi.string().required(),
          value: dbconn.password,
        },
        port: {
          joi: Joi.number().default(3306),
          value: dbconn.port,
        },
        username: {
          joi: Joi.string().required(),
          value: dbconn.username,
        },
        synchronize: {
          joi: Joi.bool().default(false),
          value: dbconn.synchronize,
        },
        logging: {
          joi: Joi.bool().default(true),
          value: dbconn.logging,
        },
        type: {
          joi: Joi.string().default('mariadb'),
          value: dbconn.type,
        },
      }),
    ),
  ],
  providers: [ConfigService, SqlConfigService],
  exports: [ConfigService, SqlConfigService],
})
export class SqlConfigModule {}
