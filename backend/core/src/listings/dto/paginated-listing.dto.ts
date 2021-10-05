import { PaginationFactory } from "../../shared/dto/pagination.dto"
import { ListingDto } from "./listing.dto"

export class PaginatedListingDto extends PaginationFactory<ListingDto>(ListingDto) {}
