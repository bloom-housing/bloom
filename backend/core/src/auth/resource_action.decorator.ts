import { SetMetadata } from "@nestjs/common"

export const ResourceAction = (action: string) => SetMetadata("authz_action", action)
