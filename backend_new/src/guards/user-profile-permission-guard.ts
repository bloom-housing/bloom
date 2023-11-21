import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { User } from '../dtos/users/user.dto';
import { PermissionService } from '../services/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionService: PermissionService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    const type = this.reflector.getAllAndOverride<string>('permission_type', [
      context.getClass(),
      context.getHandler(),
    ]);
    return this.permissionService.can(user, type, permissionActions.read, {
      id: user.id,
    });
  }
}
