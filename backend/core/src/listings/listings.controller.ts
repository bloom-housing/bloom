import {
  Body,
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
} from "@nestjs/common"
import { ListingsService } from "./listings.service"
import { ApiBearerAuth, ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger"
import { Cache } from "cache-manager"
import {
  ListingCreateDto,
  ListingDto,
  ListingUpdateDto,
  PaginatedListingDto,
  ListingsQueryParams,
  ListingFilterParams,
} from "./dto/listing.dto"
import { ResourceType } from "../auth/decorators/resource-type.decorator"
import { OptionalAuthGuard } from "../auth/guards/optional-auth.guard"
import { AuthzGuard } from "../auth/guards/authz.guard"
import { mapTo } from "../shared/mapTo"
import { defaultValidationPipeOptions } from "../shared/default-validation-pipe-options"
import { clearCacheKeys } from "../libs/cacheLib"

@Controller("listings")
@ApiTags("listings")
@ApiBearerAuth()
@ResourceType("listing")
@UseGuards(OptionalAuthGuard, AuthzGuard)
@UsePipes(new ValidationPipe(defaultValidationPipeOptions))
export class ListingsController {
  cacheKeys: string[]
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly listingsService: ListingsService
  ) {
    this.cacheKeys = [
      "/listings",
      "/listings?limit=all",
      "/listings?limit=all&filter[$comparison]=%3C%3E&filter[status]=pending",
    ]
  }

  // TODO: Limit requests to defined fields
  @Get()
  @ApiExtraModels(ListingFilterParams)
  @ApiOperation({ summary: "List listings", operationId: "list" })
  // ClassSerializerInterceptor has to come after CacheInterceptor
  @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
  public async getAll(@Query() queryParams: ListingsQueryParams): Promise<PaginatedListingDto> {
    return mapTo(PaginatedListingDto, await this.listingsService.list(queryParams))
  }

  @Post()
  @ApiOperation({ summary: "Create listing", operationId: "create" })
  async create(@Body() listingDto: ListingCreateDto): Promise<ListingDto> {
    const listing = await this.listingsService.create(listingDto)
    /**
     * clear list caches
     * As we get more listings we'll want to update this to be more selective in clearing entries
     */
    await clearCacheKeys(this.cacheManager, this.cacheKeys)
    return mapTo(ListingDto, listing)
  }

  @Get(`:listingId`)
  @ApiOperation({ summary: "Get listing by id", operationId: "retrieve" })
  @UseInterceptors(CacheInterceptor, ClassSerializerInterceptor)
  async retrieve(@Param("listingId") listingId: string): Promise<ListingDto> {
    if (listingId === undefined || listingId === "undefined") {
      return mapTo(ListingDto, {})
    }
    const result = mapTo(ListingDto, await this.listingsService.findOne(listingId))

    return result
  }

  @Put(`:listingId`)
  @ApiOperation({ summary: "Update listing by id", operationId: "update" })
  async update(
    @Param("listingId") listingId: string,
    @Body() listingUpdateDto: ListingUpdateDto
  ): Promise<ListingDto> {
    const listing = await this.listingsService.update(listingUpdateDto)
    /**
     * clear list caches
     * As we get more listings we'll want to update this to be more selective in clearing entries
     */
    await clearCacheKeys(this.cacheManager, [...this.cacheKeys, `/listings/${listingId}`])
    return mapTo(ListingDto, listing)
  }

  @Delete(`:listingId`)
  @ApiOperation({ summary: "Delete listing by id", operationId: "delete" })
  async delete(@Param("listingId") listingId: string) {
    await this.listingsService.delete(listingId)
    await clearCacheKeys(this.cacheManager, [...this.cacheKeys, `/listings/${listingId}`])
  }
}
