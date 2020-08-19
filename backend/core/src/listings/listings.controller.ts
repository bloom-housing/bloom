import { Controller, Get, Query, Request } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ListingsListResponse } from "./listings.dto"
import { Request as ExpressRequest } from "express"
import { getPreferredLanguage } from "../lib/translations"

@Controller()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  public async getAll(
    @Request() req: ExpressRequest,
    @Query("jsonpath") jsonpath?: string
  ): Promise<ListingsListResponse> {
    const languageCode = getPreferredLanguage(req)
    return this.listingsService.list(jsonpath, languageCode)
  }
}
