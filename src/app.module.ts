import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { RoleModule, UserAuthModule } from '@personal/user-auth';
import { AuthController } from '@personal/user-auth/src/controller/v2/auth.controller';
import { AppConfigModule, HealthModule } from '@personal/common';
import { DatabaseProviderModule } from './provider/provider.module';
import { ConfigModule } from '@nestjs/config';
import { DBUserModule } from './modules/user/user.module';
import { DBUserService } from './modules/user/user.service';
import { DBRolesService } from './modules/role/role.service';
import { DBRoleModule } from './modules/role/role.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ApplicationModule } from './modules/application/application.module';
import { AandMAuthController } from './modules/common/modules/auth/aandm-auth.controller';
import { UserController } from '@personal/user-auth/src/controller/v2/user.controller';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    HealthModule,
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
      controllers: [AandMAuthController, AuthController, UserController],
    }),
    ActivityModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
