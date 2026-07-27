import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { SanitizeHtml } from '../../decorators/sanitize-html.decorator';

export class FaqItemDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  question: string;

  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @SanitizeHtml()
  @ApiProperty()
  answerHtml: string;

  // Tombstone: a non-English row sets this to drop the English item from the merge.
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  _deleted?: boolean;
}

export class FaqCategoryDTO {
  @Expose()
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  id: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  title?: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FaqItemDTO)
  @ApiPropertyOptional({ type: FaqItemDTO, isArray: true })
  items?: FaqItemDTO[];

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsBoolean({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  _deleted?: boolean;
}

export class FaqContentDTO {
  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsArray({ groups: [ValidationsGroupsEnum.default] })
  @ValidateNested({ groups: [ValidationsGroupsEnum.default], each: true })
  @Type(() => FaqCategoryDTO)
  @ApiPropertyOptional({ type: FaqCategoryDTO, isArray: true })
  categories?: FaqCategoryDTO[];
}
