import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { DBRolesService } from './role.service';
@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [DBRolesService],
  exports: [DBRolesService],
})
export class DBRoleModule {}
