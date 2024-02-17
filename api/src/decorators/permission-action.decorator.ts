import { SetMetadata } from '@nestjs/common';

export const PermissionAction = (action: string) =>
  SetMetadata('permission_action', action);
