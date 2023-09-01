import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserCreateParams {
  @Expose()
  @ApiPropertyOptional({
    type: Boolean,
    example: true,
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: TransformFnParams) => value?.value === 'true', {
    toClassOnly: true,
  })
  noWelcomeEmail?: boolean;
}
