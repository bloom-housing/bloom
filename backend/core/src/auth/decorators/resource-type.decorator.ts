import { SetMetadata } from "@nestjs/common"

export const ResourceType = (type: string) => SetMetadata("authz_type", type)
