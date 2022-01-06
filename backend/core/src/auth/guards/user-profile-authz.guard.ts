import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthzService } from "../services/authz.service"
import { Reflector } from "@nestjs/core"
import { authzActions } from "../enum/authz-actions.enum"

@Injectable()
export class UserProfileAuthzGuard implements CanActivate {
  constructor(private authzService: AuthzService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authUser = req.user
    const type = this.reflector.getAllAndOverride<string>("authz_type", [
      context.getClass(),
      context.getHandler(),
    ])
    return this.authzService.can(authUser, type, authzActions.read, { id: authUser.id })
  }
}
