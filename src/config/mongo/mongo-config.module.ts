import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import configuration from './mongo-configuration';
import { MongoConfigService } from './mongo-config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
/**
 * Import and provide app configuration related classes.
 *
 * @module
 */
const ENV = process.env.NODE_ENV;
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().default('localhost'),
        MONGO_PORT: Joi.number().default(27017),
        MONGO_USERNAME: Joi.string(),
        MONGO_PASSWORD: Joi.string(),
        MONGO_DATABASE: Joi.string().default(null),
      }),
    }),
  ],
  providers: [ConfigService, MongoConfigService],
  exports: [ConfigService, MongoConfigService],
})
export class MongoConfigModule {}
