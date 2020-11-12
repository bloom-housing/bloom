import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { ListingEventCreateDto, ListingEventDto, ListingEventUpdateDto } from "./listing-events.dto"
import { ListingEventsService } from "./listing-events.service"
import { mapTo } from "../shared/mapTo"
import { OptionalAuthGuard } from "../auth/optional-auth.guard"

@Controller("/listingEvents")
@ApiTags("listingEvents")
@ApiBearerAuth()
@ResourceType("listingEvent")
@UseGuards(OptionalAuthGuard, AuthzGuard)
export class ListingEventsController {
  constructor(private readonly listingEventsService: ListingEventsService) {}

  @Get()
  @ApiOperation({ summary: "List listingEvents", operationId: "list" })
  async list(): Promise<ListingEventDto[]> {
    return mapTo(ListingEventDto, await this.listingEventsService.list())
  }

  @Post()
  @ApiOperation({ summary: "Create listingEvent", operationId: "create" })
  async create(@Body() listingEvent: ListingEventCreateDto): Promise<ListingEventDto> {
    return mapTo(ListingEventDto, await this.listingEventsService.create(listingEvent))
  }

  @Put(`:listingEventId`)
  @ApiOperation({ summary: "Update listingEvent", operationId: "update" })
  async update(@Body() listingEvent: ListingEventUpdateDto): Promise<ListingEventDto> {
    return mapTo(ListingEventDto, await this.listingEventsService.update(listingEvent))
  }

  @Get(`:listingEventId`)
  @ApiOperation({ summary: "Get listingEvent by id", operationId: "retrieve" })
  async retrieve(@Param("listingEventId") listingEventId: string): Promise<ListingEventDto> {
    return mapTo(
      ListingEventDto,
      await this.listingEventsService.findOne({ where: { id: listingEventId } })
    )
  }

  @Delete(`:listingEventId`)
  @ApiOperation({ summary: "Delete listingEvent by id", operationId: "delete" })
  async delete(@Param("listingEventId") listingEventId: string): Promise<void> {
    return await this.listingEventsService.delete(listingEventId)
  }
}
