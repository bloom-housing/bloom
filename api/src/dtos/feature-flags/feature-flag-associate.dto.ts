import { Expose } from 'class-transformer';
import { IsArray, IsDefined, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class FeatureFlagAssociate {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @ApiProperty()
  associate: string[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, {
    groups: [ValidationsGroupsEnum.default],
    each: true,
  })
  @ApiProperty()
  remove: string[];
}
