import { Controller, Get, Query } from "@nestjs/common"
import { ListingsFindAllResponse, ListingsQueryParams, ListingsService } from "./listings.service"
import { ApiOkResponse } from "@nestjs/swagger"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOkResponse({
    type: ListingsFindAllResponse,
  })
  public async getAll(
    @Query() queryParams?: ListingsQueryParams
  ): Promise<ListingsFindAllResponse> {
    return await this.listingsService.findAll(queryParams)
  }
}
