import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule, UserAuthModule } from '@personal/user-auth';
import { AppConfigModule } from '@personal/common';
import { DatabaseProviderModule } from './provider/provider.module';
import { ConfigModule } from '@nestjs/config';
import { DBUserModule } from './modules/user/user.module';
import { DBUserService } from './modules/user/user.service';
import { DBRolesService } from './modules/role/role.service';
import { DBRoleModule } from './modules/role/role.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      isGlobal: true,
    }),
    DatabaseProviderModule,
    AppConfigModule,
    RoleModule.registerAsync({
      useFactory: (roleService: DBRolesService) => roleService,
      inject: [DBRolesService],
      imports: [DBRoleModule],
    }),
    UserAuthModule.registerAsync({
      useFactory: (configService: DBUserService) => {
        return configService;
      },
      inject: [DBUserService],
      imports: [DBUserModule],
    }),
    // HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
