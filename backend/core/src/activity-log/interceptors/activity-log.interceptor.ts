import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { ActivityLogService } from "../services/activity-log.service"
import { Reflector } from "@nestjs/core"
import { httpMethodsToAction } from "../../shared/http-methods-to-actions"
import { User } from "../../auth/entities/user.entity"
import { authzActions } from "../../auth/enum/authz-actions.enum"
import { endWith, ignoreElements, mergeMap } from "rxjs/operators"
import { from } from "rxjs"
import { ActivityLogMetadataType } from "../types/activity-log-metadata-type"
import { deepFind } from "../../shared/utils/deep-find"

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    protected readonly activityLogService: ActivityLogService,
    protected reflector: Reflector
  ) {}

  getBasicRequestInfo(
    context: ExecutionContext
  ): {
    module?: string
    action?: string
    resourceId?: string
    user?: User
    activityLogMetadata: ActivityLogMetadataType
  } {
    const req = context.switchToHttp().getRequest()
    const module = this.reflector.getAllAndOverride<string>("authz_type", [
      context.getClass(),
      context.getHandler(),
    ])
    const action =
      this.reflector.get<string>("authz_action", context.getHandler()) ||
      httpMethodsToAction[req.method]
    const user: User | null = req.user
    const activityLogMetadata = this.reflector.getAllAndOverride<ActivityLogMetadataType>(
      "activity_log_metadata",
      [context.getClass(), context.getHandler()]
    )
    return { module, action, user, activityLogMetadata }
  }

  extractMetadata(body: any, activityLogMetadata: ActivityLogMetadataType) {
    let metadata
    if (activityLogMetadata) {
      metadata = {}
      for (const trackPropertiesMetadata of activityLogMetadata) {
        metadata[trackPropertiesMetadata.targetPropertyName] = deepFind(
          body,
          trackPropertiesMetadata.propertyPath
        )
      }
    }
    return metadata
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler) {
    const { module, action, user, activityLogMetadata } = this.getBasicRequestInfo(context)

    if (action === authzActions.read) {
      return next.handle()
    }

    const metadata = this.extractMetadata(
      context.switchToHttp().getRequest().body,
      activityLogMetadata
    )

    return next.handle().pipe(
      mergeMap((value) =>
        // NOTE: Resource ID is taken from the response value because it does not exist for e.g. create endpoints
        {
          const req = context.switchToHttp().getRequest()
          let resourceId
          if (req.method === "POST") {
            resourceId = value?.id
          } else {
            resourceId = req.body.id
          }
          return from(this.activityLogService.log(module, action, resourceId, user, metadata)).pipe(
            ignoreElements(),
            endWith(value)
          )
        }
      )
    )
  }
}
