import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { EmailConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BaseConfigModule } from '@personal/common/dist/config-util/base-module/base-config.module';
import { JoiUtil } from '@personal/common';
import { IEmailConfig } from './config.interface';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
@Module({
  imports: [
    BaseConfigModule,
    ConfigModule.forFeature(
      JoiUtil.validateAndRegister<IEmailConfig>('email', {
        adminEmail: {
          joi: Joi.string().email().required(),
          value: process.env.EMAIL_ADMIN_EMAIL,
        },
        emailFrom: {
          joi: Joi.string().required(),
          value: process.env.EMAIL_FROM,
        },
      }),
    ),
  ],
  providers: [ConfigService, EmailConfigService],
  exports: [ConfigService, EmailConfigService],
})
export class EmailConfigModule {}
