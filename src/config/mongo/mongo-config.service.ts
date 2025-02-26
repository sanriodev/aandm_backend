import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';
/**
 * Service dealing with app config based operations.
 *
 * @class
 */
@Injectable()
export class MongoConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    if (this.username && this.password) {
      return {
        uri:
          `mongodb://${this.username}:${this.password}@${this.uri}` +
          (this.database ? `/?authSource=${this.database}` : ''),
        dbName: this.database,
      };
    } else {
      return { uri: this.uri };
    }
  }

  get uri(): string {
    return this.configService.get<string>('mongo.uri');
  }
  get username(): string {
    return this.configService.get<string>('mongo.username');
  }
  get password(): string {
    return this.configService.get<string>('mongo.password');
  }
  get database(): string {
    return this.configService.get<string>('mongo.database');
  }
}
