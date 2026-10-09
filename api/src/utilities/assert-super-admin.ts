import { ForbiddenException } from '@nestjs/common';
import { User } from '../dtos/users/user.dto';

export const assertSuperAdmin = (user?: User): void => {
  if (!user?.userRoles?.isSuperAdmin) {
    throw new ForbiddenException();
  }
};
