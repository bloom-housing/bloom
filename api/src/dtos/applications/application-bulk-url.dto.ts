import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, MinLength, IsString, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ApplicationBulkUrl {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiProperty()
  listingId: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiProperty()
  userId: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MinLength(1, { groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.applicants] })
  @ApiProperty()
  uploadUrl: string;
}
