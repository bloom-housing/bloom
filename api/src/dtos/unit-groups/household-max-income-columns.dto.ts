import { Expose } from 'class-transformer';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { ValidationsGroupsEnum } from '../../enums/shared/validation-groups-enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HMIColumns {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  @ApiProperty()
  householdSize: string;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '20'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '25'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '30'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '35'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '40'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '45'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '50'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '55'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '60'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '70'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '80'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '100'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '120'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '125'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '140'?: number;

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @ApiPropertyOptional()
  '150'?: number;
}
