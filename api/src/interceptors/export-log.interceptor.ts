import { CallHandler, ExecutionContext, Injectable } from '@nestjs/common';
import { ActivityLogInterceptor } from './activity-log.interceptor';
import { endWith, from, ignoreElements, mergeMap } from 'rxjs';
import { PrismaService } from '../services/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ExportLogInterceptor extends ActivityLogInterceptor {
  constructor(reflector: Reflector, prisma: PrismaService) {
    super(reflector, prisma);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const { module, user } = this.getBasicRequestInfo(context);
    return next.handle().pipe(
      mergeMap((value) => {
        const req = context.switchToHttp().getRequest();
        let resourceId;
        if (module === 'application') {
          resourceId = req.query.listingId;
        }
        return from(
          this.prisma.activityLog.create({
            include: {
              userAccounts: true,
            },
            data: {
              module,
              recordId: resourceId,
              action: 'export',
              userAccounts: {
                connect: {
                  id: user.id,
                },
              },
            },
          }),
        ).pipe(ignoreElements(), endWith(value));
      }),
    );
  }
}
