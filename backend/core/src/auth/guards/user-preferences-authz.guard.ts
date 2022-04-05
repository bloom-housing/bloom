import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { AuthzService } from "../services/authz.service"
import { Reflector } from "@nestjs/core"
import { httpMethodsToAction } from "../../shared/http-methods-to-actions"

@Injectable()
export class UserPreferencesAuthzGuard implements CanActivate {
  constructor(private authzService: AuthzService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authUser = req.user
    const action =
      this.reflector.get<string>("authz_action", context.getHandler()) ||
      httpMethodsToAction[req.method]

    return await this.authzService.can(authUser, "userPreference", action, {
      id: req.params.id,
    })
  }
}
