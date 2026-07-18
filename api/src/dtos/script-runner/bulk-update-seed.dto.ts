import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsInt, IsString, IsUUID, Max, Min } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class BulkUpdateSeedDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  listingId: string;

  @Expose()
  @IsInt({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Min(1, { groups: [ValidationsGroupsEnum.default] })
  @Max(10000, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  count: number;
}
