import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { endWith, ignoreElements, mergeMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { User } from '../dtos/users/user.dto';
import { httpMethodsToAction } from '../enums/permissions/http-method-to-actions-enum';
import { permissionActions } from '../enums/permissions/permission-actions-enum';
import { deepFind } from '../utilities/deep-find';
import { PrismaService } from '../services/prisma.service';

export type ActivityLogMetadataType = Array<{
  targetPropertyName: string;
  propertyPath?: string;
  defaultValue?: string;
  customRecordId?: string;
}>;

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector, protected prisma: PrismaService) {}

  /*
    builds the metadata that gets stored in the activity log
  */
  extractMetadata(body: any, activityLogMetadata: ActivityLogMetadataType) {
    let metadata;
    if (activityLogMetadata) {
      metadata = {};
      for (const trackPropertiesMetadata of activityLogMetadata) {
        if (
          !trackPropertiesMetadata.defaultValue &&
          !trackPropertiesMetadata.propertyPath
        )
          metadata[trackPropertiesMetadata.targetPropertyName] = null;
        else {
          metadata[trackPropertiesMetadata.targetPropertyName] =
            trackPropertiesMetadata.defaultValue ??
            deepFind(body, trackPropertiesMetadata.propertyPath);
        }
      }
    }
    return metadata;
  }

  /*
    parses the request to get some of the basic info we will need during the intercept step
  */
  getBasicRequestInfo(context: ExecutionContext): {
    module?: string;
    action?: string;
    resourceId?: string;
    user?: User;
    activityLogMetadata: ActivityLogMetadataType;
  } {
    const req = context.switchToHttp().getRequest();
    const module = this.reflector.getAllAndOverride<string>('permission_type', [
      context.getClass(),
      context.getHandler(),
    ]);

    const action =
      this.reflector.get<string>('permission_action', context.getHandler()) ||
      httpMethodsToAction[req.method];

    const user: User | null = req['user'];
    const activityLogMetadata =
      this.reflector.getAllAndOverride<ActivityLogMetadataType>(
        'activity_log_metadata',
        [context.getClass(), context.getHandler()],
      );
    return { module, action, user, activityLogMetadata };
  }

  /*
    parses and stores into the activity log table
  */
  intercept(context: ExecutionContext, next: CallHandler) {
    const { module, action, user, activityLogMetadata } =
      this.getBasicRequestInfo(context);
    if (
      action === permissionActions.read ||
      action === permissionActions.submit
    ) {
      // if the action is a read or a submit we don't need to log the activity
      return next.handle();
    }

    const metadata = this.extractMetadata(
      context.switchToHttp().getRequest().body,
      activityLogMetadata,
    );

    return next.handle().pipe(
      mergeMap((value) =>
        // NOTE: Resource ID is taken from the response value because it does not exist for e.g. create endpoints
        {
          const req = context.switchToHttp().getRequest();
          let resourceId;
          if (req.method === 'POST') {
            resourceId = value?.id;
          } else {
            resourceId = req.body.id;
          }
          resourceId =
            activityLogMetadata?.length && activityLogMetadata[0].customRecordId
              ? activityLogMetadata[0].customRecordId
              : resourceId;
          return from(
            this.prisma.activityLog.create({
              include: {
                userAccounts: true,
              },
              data: {
                module,
                recordId: resourceId,
                action,
                metadata,
                userAccounts: {
                  connect: {
                    id: user.id,
                  },
                },
              },
            }),
          ).pipe(ignoreElements(), endWith(value));
        },
      ),
    );
  }
}
