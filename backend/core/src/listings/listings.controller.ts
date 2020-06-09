import { Controller, Get, Query } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiOkResponse } from "@nestjs/swagger"
import { ListingsFindAllQueryParams, ListingsFindAllResponse } from "./listings.dto"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOkResponse({
    type: ListingsFindAllResponse,
  })
  public async getAll(
    @Query() queryParams?: ListingsFindAllQueryParams
  ): Promise<ListingsFindAllResponse> {
    return await this.listingsService.findAll(queryParams)
  }
}
