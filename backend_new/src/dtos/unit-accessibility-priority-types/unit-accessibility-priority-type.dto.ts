import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { UnitAccessibilityPriorityTypeEnum } from '@prisma/client';

export class UnitAccessibilityPriorityType extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UnitAccessibilityPriorityTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: UnitAccessibilityPriorityTypeEnum,
    enumName: 'UnitAccessibilityPriorityTypeEnum',
  })
  name: UnitAccessibilityPriorityTypeEnum;
}
