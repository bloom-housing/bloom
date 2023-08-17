import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserCreateParams {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    required: false,
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @Transform((value: TransformFnParams) => value?.value === 'true', {
    toClassOnly: true,
  })
  noWelcomeEmail?: boolean;
}
