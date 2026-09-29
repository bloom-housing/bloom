import { timingSafeEqual } from 'crypto';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

const matches = (supplied: unknown, secret: string): boolean => {
  if (typeof supplied !== 'string') return false;

  const a = Buffer.from(supplied);
  const b = Buffer.from(secret);
  // timingSafeEqual throws on a length mismatch, which would itself leak the length.
  return a.length === b.length && timingSafeEqual(a, b);
};

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const secret = process.env.API_PASS_KEY;

    if (secret && !matches(req.headers.passkey, secret)) {
      throw new UnauthorizedException('Traffic not from a known source');
    }

    return true;
  }
}
