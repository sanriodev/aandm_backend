// import {
//   Get,
//   Controller,
//   UseGuards,
//   ValidationPipe,
//   UsePipes,
//   Inject,
//   Version,
//   ForbiddenException,
//   Query,
//   Patch,
// } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiExtraModels,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import {
//   JWTAuthGuard,
//   JWTPayload,
//   Permissions,
//   PermissionsGuard,
//   ReS,
//   UserFromRequest,
//   UserService,
// } from '@personal/common';
// import { DBUserService } from './user.service';
// import { User } from './entity/user.entity';
// import { UserControllerV2 } from '@personal/user-auth';

// @Controller('user')
// @ApiTags('user')
// @UseGuards(PermissionsGuard)
// @UseGuards(JWTAuthGuard)
// @ApiExtraModels(ReS)
// @ApiResponse({ status: 403, description: 'Forbidden.' })
// export class DBUserController extends UserControllerV2 {
//   constructor(
//     @Inject(DBUserService)
//     dbuserService: DBUserService,
//   ) {
//     //super(userService);
//   }

//   @Patch('/public-activity')
//   @Version('1')
//   @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
//   @UseGuards(JWTAuthGuard)
//   @ApiBearerAuth()
//   @Permissions('user:update:own')
//   @ApiOperation({
//     summary: 'update own user',
//     description: 'update own user activity privacy settings',
//   })
//   async getActivity(
//     @UserFromRequest() user: JWTPayload,
//     @Query('publicActivity') publicActivity: boolean = false,
//   ): Promise<ReS<User>> {
//     if (!user.user.id) {
//       throw new ForbiddenException('unauthenticated');
//     }
//     return ReS.FromData(
//       await this.userService.updateActivitySetting(
//         publicActivity,
//         user.user.id,
//       ),
//     );
//   }
// }
