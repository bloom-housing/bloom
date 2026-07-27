import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../dtos/users/user.dto';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const authUser: User = req['user'];
    return authUser?.userRoles?.isSuperAdmin ?? false;
  }
}
