import { ValidationPipeOptions } from "@nestjs/common"
import { ValidationsGroupsEnum } from "./validations-groups.enum"

export const defaultValidationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  transformOptions: {
    excludeExtraneousValues: true,
  },
  groups: [ValidationsGroupsEnum.default],
}
