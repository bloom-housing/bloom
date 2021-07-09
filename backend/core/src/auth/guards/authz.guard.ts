import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthzService } from "../services/authz.service"

const httpMethodsToAction = {
  PUT: "update",
  PATCH: "update",
  DELETE: "delete",
  POST: "create",
  GET: "read",
}

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private authzService: AuthzService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authUser = req.user
    const type = this.reflector.getAllAndOverride<string>("authz_type", [
      context.getClass(),
      context.getHandler(),
    ])
    const action =
      this.reflector.get<string>("authz_action", context.getHandler()) ||
      httpMethodsToAction[req.method]

    return this.authzService.can(authUser, type, action)
  }
}
