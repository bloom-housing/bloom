import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { ActivityLogService } from "../services/activity-log.service"
import { Reflector } from "@nestjs/core"
import { httpMethodsToAction } from "../../shared/http-methods-to-actions"
import { User } from "../../auth/entities/user.entity"
import { authzActions } from "../../auth/enum/authz-actions.enum"
import { tap } from "rxjs/operators"

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private reflector: Reflector
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()

    const module = this.reflector.getAllAndOverride<string>("authz_type", [
      context.getClass(),
      context.getHandler(),
    ])
    const action =
      this.reflector.get<string>("authz_action", context.getHandler()) ||
      httpMethodsToAction[req.method]
    const resourceId = req.body.id
    const user: User | null = req.user

    if (action === authzActions.read) {
      return next.handle()
    }

    return next.handle().pipe(
      tap(() => {
        if (module && action && resourceId && user) {
          void this.activityLogService.log(module, action, resourceId, user)
        }
      })
    )
  }
}
