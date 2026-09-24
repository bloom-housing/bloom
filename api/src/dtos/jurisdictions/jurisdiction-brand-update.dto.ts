import { Expose, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { BrandDTO } from './brand.dto';

export class JurisdictionBrandUpdate {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => BrandDTO)
  @ApiPropertyOptional({ type: BrandDTO, nullable: true })
  brand?: BrandDTO | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(2048, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ nullable: true })
  logoFileId?: string | null;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @MaxLength(2048, { groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional({ nullable: true })
  faviconFileId?: string | null;
}
