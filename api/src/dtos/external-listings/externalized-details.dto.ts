import { Type, Expose } from 'class-transformer';
import { ValidateNested, IsArray, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExternalizedListing } from './externalized-listing.dto';
import { IdDTO } from '../shared/id.dto';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class ExternalizedDetails {
  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  jurisdictions: IdDTO[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ExternalizedListing)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: ExternalizedListing, isArray: true })
  listings: ExternalizedListing[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  reservedCommunityTypes: IdDTO[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  unitRentTypes: IdDTO[];

  @Expose()
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => IdDTO)
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ type: IdDTO, isArray: true })
  unitTypes: IdDTO[];
}
