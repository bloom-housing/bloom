import { AbstractServiceFactory } from "../shared/abstract-service"
import { ListingEvent } from "./entities/listing-event.entity"
import { Injectable } from "@nestjs/common"
import { ListingEventCreateDto, ListingEventUpdateDto } from "./dto/listing-events.dto"

@Injectable()
export class ListingEventsService extends AbstractServiceFactory<
  ListingEvent,
  ListingEventCreateDto,
  ListingEventUpdateDto
>(ListingEvent) {}
