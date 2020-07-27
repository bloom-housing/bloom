import { Controller, Get, Query } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ListingsListResponse } from "./listings.dto"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  public async getAll(@Query("jsonpath") jsonpath?: string): Promise<ListingsListResponse> {
    return this.listingsService.list(jsonpath)
  }
}
