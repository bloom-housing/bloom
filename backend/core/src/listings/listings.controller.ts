import { Body, Controller, Get, Post, Query, UseInterceptors } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiOperation } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { ListingCreateDto } from "./listing.create.dto"
import { ListingDto, ListingExtendedDto } from "./listing.dto"

@Controller("listings")
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @UseInterceptors(new TransformInterceptor(ListingExtendedDto))
  public async getAll(@Query("jsonpath") jsonpath?: string): Promise<ListingExtendedDto> {
    return this.listingsService.list(jsonpath)
  }

  @Post()
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async create(@Body() listingDto: ListingCreateDto): Promise<ListingDto> {
    return this.listingsService.create(listingDto)
  }
}
