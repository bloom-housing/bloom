import { Expose } from 'class-transformer';
import { IsDefined, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { hasHttps } from '../../decorators/hasHttps.decorator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class IngestParams {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @hasHttps({ groups: [ValidationsGroupsEnum.default] })
  @IsUrl(
    { require_protocol: false, require_tld: false },
    { groups: [ValidationsGroupsEnum.default] },
  )
  @ApiProperty()
  externalURL: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  jurisdictionId: string;

  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  targetName: string;
}
