import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (
      process.env.API_PASS_KEY &&
      (!req.headers.passkey || req.headers.passkey !== process.env.API_PASS_KEY)
    ) {
      throw new UnauthorizedException('Traffic not from a known source');
    }

    return true;
  }
}
