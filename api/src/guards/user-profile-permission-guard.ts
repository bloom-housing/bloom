import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { User } from '../dtos/users/user.dto';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class UserProfilePermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: User = req['user'];
    console.log('user-profile-permission-guard user', user);
    console.log('user-profile-permission-guard url', req['_parsedUrl']);
    console.log('user-profile-permission-guard cookies', req['cookies']);
    const type = this.reflector.getAllAndOverride<string>('permission_type', [
      context.getClass(),
      context.getHandler(),
    ]);
    return this.permissionService.can(user, type, permissionActions.read, {
      id: user.id,
    });
  }
}
