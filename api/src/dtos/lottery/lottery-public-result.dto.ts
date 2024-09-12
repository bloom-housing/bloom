import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';

export class PublicLotteryResult {
  @Expose()
  @IsNumber({}, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  ordinal: number;

  @Expose()
  @ApiPropertyOptional()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsUUID(4, { groups: [ValidationsGroupsEnum.default] })
  multiselectQuestionId?: string;
}
