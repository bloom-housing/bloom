import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { httpMethodsToAction } from '../enums/permissions/http-method-to-actions-enum';
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
    const user: User = req['user'];

    if (user?.userRoles?.isAdmin) {
      return true;
    }

    const type = this.reflector.getAllAndOverride<string>('permission_type', [
      context.getClass(),
      context.getHandler(),
    ]);

    const action =
      this.reflector.get<string>('permission_action', context.getHandler()) ||
      httpMethodsToAction[req.method];

    let resource = {};

    if (req.params.id) {
      resource = ['GET'].includes(req.method)
        ? { id: req.params.id }
        : { id: req.body.id };
    } else if (req.body.id) {
      resource = { id: req.body.id };
    }

    return this.permissionService.can(user, type, action, resource);
  }
}
