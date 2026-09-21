import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { SanitizeHtml } from '../../decorators/sanitize-html.decorator';

export class ContactContentDTO {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  phone?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  email?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SanitizeHtml()
  @ApiPropertyOptional()
  @MaxLength(4096, { groups: [ValidationsGroupsEnum.default] })
  addressHtml?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  @MaxLength(256, { groups: [ValidationsGroupsEnum.default] })
  hours?: string;
}
