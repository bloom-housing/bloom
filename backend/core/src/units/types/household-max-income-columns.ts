import { Expose } from "class-transformer"
import { IsDefined, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ApiProperty } from "@nestjs/swagger"

export class HMIColumns {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsString()
  @ApiProperty()
  householdSize: string

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  20?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  25?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  30?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  35?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  40?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  45?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  50?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  55?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  60?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  70?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  80?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  100?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  120?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  125?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  140?: number

  @Expose()
  @IsOptional()
  @ApiProperty({ required: false })
  150?: number
}
