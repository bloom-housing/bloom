import { CallHandler, ExecutionContext, Injectable } from "@nestjs/common"
import { authzActions } from "../../auth/enum/authz-actions.enum"
import { endWith, ignoreElements, mergeMap } from "rxjs/operators"
import { ActivityLogInterceptor } from "../../activity-log/interceptors/activity-log.interceptor"
import { from } from "rxjs"

@Injectable()
export class ListingActivityLogInterceptor extends ActivityLogInterceptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest()
    const { module, action, resourceId, user } = this.getBasicRequestInfo(context)

    if (action === authzActions.read) {
      return next.handle()
    }

    return next
      .handle()
      .pipe(
        mergeMap((value) =>
          from(this.activityLogService.log(module, action, resourceId, user, req.body.status)).pipe(
            ignoreElements(),
            endWith(value)
          )
        )
      )
  }
}
