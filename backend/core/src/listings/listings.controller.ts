import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiOperation } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { ListingCreateDto } from "./listing.create.dto"
import { ListingDto, ListingExtendedDto } from "./listing.dto"
import { ListingUpdateDto } from "./listings.update.dto"

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

  @Get(`:listingId`)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async retrieve(@Param("listingId") listingId: string): Promise<ListingDto> {
    return await this.listingsService.findOne(listingId)
  }

  @Put(`:listingId`)
  @ApiOperation({ summary: "Update listing by id", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async update(
    @Param("listingId") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    return await this.listingsService.update(listingUpdateDto)
  }

  @Delete(`:listingId`)
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  async delete(@Param("listingId") listingId: string) {
    await this.listingsService.delete(listingId)
  }
}
