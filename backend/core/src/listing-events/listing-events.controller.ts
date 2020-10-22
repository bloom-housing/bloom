import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { DefaultAuthGuard } from "../auth/default.guard"
import { AuthzGuard } from "../auth/authz.guard"
import { ResourceType } from "../auth/resource_type.decorator"
import { ListingEventDto } from "./listing-events.dto"
import { ListingEventsService } from "./listing-events.service"
import { ListingEventCreateDto } from "./listing-events.create.dto"
import { ListingEventUpdateDto } from "./listing-events.update.dto"
import { mapTo } from "../shared/mapTo"

@Controller("/listingEvents")
@ApiTags("listingEvents")
@ApiBearerAuth()
@ResourceType("listingEvent")
@UseGuards(DefaultAuthGuard, AuthzGuard)
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
