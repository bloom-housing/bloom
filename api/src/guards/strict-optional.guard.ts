import { JwtAuthGuard } from './jwt.guard';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from '../passports/jwt.strategy';
import { clearStaleAuthCookies } from '../utilities/clear-auth-cookies';

/*
  like OptionalAuthGuard (anonymous callers are allowed), but a token that
  was sent and rejected such as being invalidated by a login on another device
  throws instead of silently falling back to anonymous. Use this only where
  that silent fallback would itself be the bug, such as application
  submission under mandated accounts, where the caller needs to know their
  session died instead of unknowingly submitting anonymously.
*/
@Injectable()
export class StrictOptionalAuthGuard extends JwtAuthGuard {
  handleRequest<User>(
    err: unknown,
    user: User,
    info: unknown,
    context: ExecutionContext,
  ): User | undefined {
    if (user) {
      return user;
    }

    // no token was sent at all, e.g. a logged out visitor -- treat as anonymous
    const req = context.switchToHttp().getRequest();
    if (!JwtStrategy.extractJwt(req)) {
      return undefined;
    }

    // a token was sent but failed validation -- clear it so the browser
    // doesn't keep resending a dead session, and surface the failure instead
    // of silently proceeding as anonymous
    clearStaleAuthCookies(context.switchToHttp().getResponse());

    throw err instanceof Error
      ? err
      : new UnauthorizedException('invalid or expired credentials');
  }
}
