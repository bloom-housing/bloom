import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { matchesApiPassKey } from '../utilities/api-pass-key';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (process.env.API_PASS_KEY && !matchesApiPassKey(req.headers.passkey)) {
      throw new UnauthorizedException('Traffic not from a known source');
    }

    return true;
  }
}
