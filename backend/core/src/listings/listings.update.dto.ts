import { Expose } from "class-transformer"
import { IsUUID, ValidateNested } from "class-validator"
import { ListingCreateDto } from "./listing.create.dto"

export class ListingUpdateDto extends ListingCreateDto {
  @Expose()
  @IsUUID()
  id: string
}
