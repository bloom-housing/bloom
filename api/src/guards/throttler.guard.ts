import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerLimitDetail } from '@nestjs/throttler/dist/throttler.guard.interface';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    if (req?.headers && req.headers['x-forwarded-for']) {
      // if we are passing through the proxy use forwarded for
      return req.headers['x-forwarded-for'].split(',')[0];
    }
    return req.ips.length ? req.ips[0] : req.ip;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    console.error(`IP Address: ${throttlerLimitDetail.tracker} was throttled`);
    await super.throwThrottlingException(context, throttlerLimitDetail);
  }
}
