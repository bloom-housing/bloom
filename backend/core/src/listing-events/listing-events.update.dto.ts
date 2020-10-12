import { IsString, IsUUID } from "class-validator"
import { Expose } from "class-transformer"
import { ListingEventCreateDto } from "./listing-events.create.dto"

export class ListingEventUpdateDto extends ListingEventCreateDto {
  @Expose()
  @IsString()
  @IsUUID()
  id: string
}
