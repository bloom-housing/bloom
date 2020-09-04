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
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { TransformInterceptor } from "../interceptors/transform.interceptor"
import { ListingCreateDto } from "./listing.create.dto"
import { ListingDto, ListingExtendedDto } from "./listing.dto"
import { ListingUpdateDto } from "./listings.update.dto"
import { Listing } from "../entity/listing.entity"
import { DefaultAuthGuard } from "../auth/default.guard"

// TODO Add Admin role check

@Controller("listings")
@ApiTags("listings")
@ApiBearerAuth()
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: "List listings", operationId: "list" })
  @UseInterceptors(new TransformInterceptor(ListingExtendedDto))
  public async getAll(@Query("jsonpath") jsonpath?: string): Promise<ListingExtendedDto> {
    return this.listingsService.list(jsonpath)
  }

  @Post()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async create(@Body() listingDto: ListingCreateDto): Promise<Listing> {
    return this.listingsService.create(listingDto)
  }

  @Get(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async retrieve(@Param("listingId") listingId: string): Promise<Listing> {
    return await this.listingsService.findOne(listingId)
  }

  @Put(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Update listing by id", operationId: "update" })
  @UseInterceptors(new TransformInterceptor(ListingDto))
  async update(
    @Param("listingId") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<Listing> {
    return await this.listingsService.update(listingUpdateDto)
  }

  @Delete(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  async delete(@Param("listingId") listingId: string) {
    await this.listingsService.delete(listingId)
  }
}
