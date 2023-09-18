import { JwtAuthGuard } from './jwt.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  handleRequest<User>(err, user: User) {
    // user is boolean false when not logged in
    // return undefined instead
    return user || undefined;
  }
}
