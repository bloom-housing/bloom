import { JwtAuthGuard } from './jwt.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  handleRequest(err, user) {
    // User is string "false" when not logged in
    // return undefined instead
    return user ? user : undefined;
  }
}
