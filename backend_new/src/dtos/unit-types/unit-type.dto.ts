import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsEnum } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { AbstractDTO } from '../shared/abstract.dto';
import { UnitTypeEnum } from '@prisma/client';

export class UnitType extends AbstractDTO {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(UnitTypeEnum, {
    groups: [ValidationsGroupsEnum.default],
  })
  @ApiProperty({
    enum: UnitTypeEnum,
    enumName: 'UnitTypeEnum',
  })
  name: UnitTypeEnum;

  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  numBedrooms: number;
}
