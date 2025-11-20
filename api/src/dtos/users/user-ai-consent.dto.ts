import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class UserAiConsentDto {
  @Expose()
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Whether the user has consented to AI features',
  })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  hasConsented: boolean;
}
