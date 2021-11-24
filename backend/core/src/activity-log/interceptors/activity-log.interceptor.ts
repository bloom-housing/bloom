import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { ActivityLogService } from "../services/activity-log.service"
import { Reflector } from "@nestjs/core"
import { httpMethodsToAction } from "../../shared/http-methods-to-actions"
import { User } from "../../auth/entities/user.entity"
import { authzActions } from "../../auth/enum/authz-actions.enum"
import { endWith, ignoreElements, mergeMap } from "rxjs/operators"
import { from } from "rxjs"

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    protected readonly activityLogService: ActivityLogService,
    protected reflector: Reflector
  ) {}

  getBasicRequestInfo(
    context: ExecutionContext
  ): { module?: string; action?: string; resourceId?: string; user?: User } {
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
    return { module, action, resourceId, user }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler) {
    const { module, action, resourceId, user } = this.getBasicRequestInfo(context)

    if (action === authzActions.read) {
      return next.handle()
    }

    return next
      .handle()
      .pipe(
        mergeMap((value) =>
          from(this.activityLogService.log(module, action, resourceId, user)).pipe(
            ignoreElements(),
            endWith(value)
          )
        )
      )
  }
}
