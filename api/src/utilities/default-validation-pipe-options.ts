import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationsGroupsEnum } from '../enums/shared/validation-groups-enum';

/*
  This controls the validation pipe that is inherent to NestJs
*/
export const defaultValidationPipeOptions: ValidationPipeOptions = {
  transform: true,
  transformOptions: {
    excludeExtraneousValues: true,
    enableImplicitConversion: false,
  },
  groups: [ValidationsGroupsEnum.default],
  forbidUnknownValues: true,
  skipMissingProperties: true,
};
