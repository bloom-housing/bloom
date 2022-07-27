import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"

@Injectable()
export class AdminOrJurisdictionalAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest()
    const authUser = req.user
    if (authUser?.roles?.isAdmin || authUser?.roles?.isJurisdictionalAdmin) {
      return true
    }
    return false
  }
}
