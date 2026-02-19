import {
  IsString,
  IsBoolean,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RaceEthnicitySubOption {
  @Expose()
  @ApiProperty({
    example: 'chinese',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiPropertyOptional({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  allowOtherText?: boolean;
}

export class RaceEthnicityOption {
  @Expose()
  @ApiProperty({
    example: 'asian',
  })
  @IsString()
  id: string;

  @Expose()
  @ApiPropertyOptional({
    type: RaceEthnicitySubOption,
    isArray: true,
    description: 'The list of suboptions if this option has them',
  })
  @ValidateNested({ each: true })
  @Type(() => RaceEthnicitySubOption)
  @IsArray()
  @IsOptional()
  subOptions?: RaceEthnicitySubOption[];

  @Expose()
  @ApiPropertyOptional({
    example: true,
    description: 'Whether this option allows free text input',
  })
  @IsBoolean()
  @IsOptional()
  allowOtherText?: boolean;
}

export class RaceEthnicityConfiguration {
  @Expose()
  @ApiProperty({
    type: RaceEthnicityOption,
    isArray: true,
    description:
      'List of race/ethnicity options available for this jurisdiction',
  })
  @ValidateNested({ each: true })
  @Type(() => RaceEthnicityOption)
  @IsArray()
  options: RaceEthnicityOption[];
}
