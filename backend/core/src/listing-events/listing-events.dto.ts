import { ApiHideProperty, OmitType } from "@nestjs/swagger"
import { ListingEvent } from "../entity/listing-event.entity"
import { Exclude, Expose } from "class-transformer"
import { IsString, IsUUID } from "class-validator"

export class ListingEventDto extends OmitType(ListingEvent, ["listing"] as const) {
  @Exclude()
  @ApiHideProperty()
  listing
}

export class ListingEventCreateDto extends OmitType(ListingEventDto, [
  "id",
  "createdAt",
  "updatedAt",
] as const) {}

export class ListingEventUpdateDto extends ListingEventCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
