import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    return request.user.id === request.params.get("userId", null)
  }
}
