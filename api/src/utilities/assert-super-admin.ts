import { ForbiddenException } from '@nestjs/common';
import { User } from '../dtos/users/user.dto';

// Translations, content, branding and their transfer are edited in Partners' superadmin-only Admin section.
export const assertSuperAdmin = (user?: User): void => {
  if (!user?.userRoles?.isSuperAdmin) {
    throw new ForbiddenException();
  }
};
