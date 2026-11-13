import { JwtAuthGuard } from './jwt.guard';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtStrategy } from '../passports/jwt.strategy';

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

    // no token was sent at all, e.g. a logged out visitor -- treat as anonymous
    const req = context.switchToHttp().getRequest();
    if (!JwtStrategy.extractJwt(req)) {
      return undefined;
    }

    // a token was sent but failed validation (expired single-active-token,
    // tampered, or the user no longer exists) -- surface this instead of
    // silently falling back to an anonymous request, so the caller can tell
    // a dead session from an actual logged-out visitor
    throw err instanceof Error
      ? err
      : new UnauthorizedException('invalid or expired credentials');
  }
}
