import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthzService } from "../services/authz.service"
import { httpMethodsToAction } from "../../shared/http-methods-to-actions"

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor(private authzService: AuthzService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authUser = req.user

    if (authUser?.roles?.isAdmin) {
      return true
    }

    const type = this.reflector.getAllAndOverride<string>("authz_type", [
      context.getClass(),
      context.getHandler(),
    ])
    const action =
      this.reflector.get<string>("authz_action", context.getHandler()) ||
      httpMethodsToAction[req.method]

    let resource

    if (req.params.id) {
      // NOTE: implicit assumption that if request.params contains an ID it also means that for requests other
      //  than GET and DELETE body also contains one too and it should be the same
      //  This prevents a security hole where user specifies params.id different than dto.id to pass authorization
      //  but actually edits a different resource
      resource = ["GET"].includes(req.method) ? { id: req.params.id } : { id: req.body.id }
    } else if (req.body.id) {
      resource = { id: req.body.id }
    }

    return this.authzService.can(authUser, type, action, resource)
  }
}
