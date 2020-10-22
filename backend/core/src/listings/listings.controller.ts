import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { ListingCreateDto } from "./listing.create.dto"
import { ListingDto, ListingExtendedDto } from "./listing.dto"
import { ListingUpdateDto } from "./listings.update.dto"
import { DefaultAuthGuard } from "../auth/default.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ApiImplicitQuery } from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator"
import { mapTo } from "../shared/mapTo"

@Controller("listings")
@ApiTags("listings")
@ApiBearerAuth()
@ResourceType("listing")
@UseGuards(OptionalAuthGuard, AuthzGuard)
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @ApiOperation({ summary: "List listings", operationId: "list" })
  @ApiImplicitQuery({
    name: "jsonpath",
    required: false,
    type: String,
  })
  public async getAll(@Query("jsonpath") jsonpath?: string): Promise<ListingExtendedDto> {
    return mapTo(ListingExtendedDto, await this.listingsService.list(jsonpath))
  }

  @Post()
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  async create(@Body() listingDto: ListingCreateDto): Promise<ListingDto> {
    return mapTo(ListingDto, await this.listingsService.create(listingDto))
  }

  @Get(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  async retrieve(@Param("listingId") listingId: string): Promise<ListingDto> {
    return mapTo(ListingDto, await this.listingsService.findOne(listingId))
  }

  @Put(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Update listing by id", operationId: "update" })
  async update(
    @Param("listingId") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    return mapTo(ListingDto, await this.listingsService.update(listingUpdateDto))
  }

  @Delete(`:listingId`)
  @UseGuards(DefaultAuthGuard)
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  async delete(@Param("listingId") listingId: string) {
    await this.listingsService.delete(listingId)
  }
}
