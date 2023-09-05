import { JwtAuthGuard } from './jwt.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  handleRequest(err, user) {
    // user is boolean false when not logged in
    // return undefined instead
    return user || undefined;
  }
}
