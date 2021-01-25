import { ValidationPipeOptions } from "@nestjs/common"
import { ValidationsGroupsEnum } from "./validations-groups.enum"

export const defaultValidationPipeOptions: ValidationPipeOptions = {
  transform: true,
  transformOptions: {
    excludeExtraneousValues: true,
    enableImplicitConversion: false,
  },
  groups: [ValidationsGroupsEnum.default],
  forbidUnknownValues: true,
}
