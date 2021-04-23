import { Expose, Type } from "class-transformer"
import { IsDate, IsDefined, IsEnum, IsOptional, IsString } from "class-validator"
import { ValidationsGroupsEnum } from "../../shared/types/validations-groups-enum"
import { ListingEventType } from "../types/listing-event-type-enum"
import { ApiProperty } from "@nestjs/swagger"

export class ListingEventDto {
  @Expose()
  @IsDefined({ groups: [ValidationsGroupsEnum.default] })
  @IsEnum(ListingEventType, { groups: [ValidationsGroupsEnum.default] })
  @ApiProperty({ enum: ListingEventType, enumName: "ListingEventType" })
  type: ListingEventType

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  startTime?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsDate({ groups: [ValidationsGroupsEnum.default] })
  @Type(() => Date)
  endTime?: Date

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  url?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  note?: string | null

  @Expose()
  @IsOptional({ groups: [ValidationsGroupsEnum.default] })
  @IsString({ groups: [ValidationsGroupsEnum.default] })
  label?: string | null
}
