import { Controller, Get, Query } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ListingsListQueryParams, ListingsListResponse } from "./listings.dto"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  public async getAll(
    @Query() queryParams?: ListingsListQueryParams
  ): Promise<ListingsListResponse> {
    return await this.listingsService.list(queryParams)
  }
}
