import { SetMetadata } from '@nestjs/common';

export const ResourceAction = (action: string) =>
  SetMetadata('permission_action', action);
