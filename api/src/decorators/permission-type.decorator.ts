import { SetMetadata } from '@nestjs/common';

export const PermissionTypeDecorator = (type: string) =>
  SetMetadata('permission_type', type);
