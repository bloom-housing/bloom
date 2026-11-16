import { JwtAuthGuard } from './jwt.guard';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtStrategy } from '../passports/jwt.strategy';
import { clearStaleAuthCookies } from '../utilities/clear-auth-cookies';

/*
  used on routes that should work for both logged in and anonymous callers
  (e.g. public listing/map reads). Any auth failure -- no token, expired, or
  invalidated by a login elsewhere -- degrades to an anonymous request rather
  than blocking it. If a token was sent but rejected, we also clear the
  browser's auth cookies so it stops resending a dead session on every
  subsequent request. Routes where an anonymous fallback would itself be a
  bug (e.g. application submission) should use StrictOptionalAuthGuard
  instead.
*/
@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  handleRequest<User>(
    err: unknown,
    user: User,
    info: unknown,
    context: ExecutionContext,
  ): User | undefined {
    if (user) {
      return user;
    }

    const req = context.switchToHttp().getRequest();
    if (JwtStrategy.extractJwt(req)) {
      clearStaleAuthCookies(context.switchToHttp().getResponse());
    }

    return undefined;
  }
}
