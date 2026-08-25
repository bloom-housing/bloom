import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { SanitizeHtml } from '../../decorators/sanitize-html.decorator';

export class DisclaimersContentDTO {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SanitizeHtml()
  @ApiPropertyOptional()
  privacyHtml?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SanitizeHtml()
  @ApiPropertyOptional()
  disclaimerHtml?: string;
}
