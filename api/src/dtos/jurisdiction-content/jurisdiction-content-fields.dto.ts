import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { FooterContentDTO } from './footer-content.dto';
import { FaqContentDTO } from './faq-content.dto';
import { ResourcesContentDTO } from './resources-content.dto';
import { DisclaimersContentDTO } from './disclaimers-content.dto';
import { ContactContentDTO } from './contact-content.dto';

export class JurisdictionContentFields {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FooterContentDTO)
  @ApiPropertyOptional({ type: FooterContentDTO })
  footer?: FooterContentDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => FaqContentDTO)
  @ApiPropertyOptional({ type: FaqContentDTO })
  faq?: FaqContentDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ResourcesContentDTO)
  @ApiPropertyOptional({ type: ResourcesContentDTO })
  resources?: ResourcesContentDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => DisclaimersContentDTO)
  @ApiPropertyOptional({ type: DisclaimersContentDTO })
  disclaimers?: DisclaimersContentDTO;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => ContactContentDTO)
  @ApiPropertyOptional({ type: ContactContentDTO })
  contact?: ContactContentDTO;
}
