import { AbstractServiceFactory } from "../shared/abstract-service"
import { ListingEvent } from "../entity/listing-event.entity"
import { ListingEventCreateDto } from "./listing-events.create.dto"
import { ListingEventUpdateDto } from "./listing-events.update.dto"
import { Injectable } from "@nestjs/common"

@Injectable()
export class ListingEventsService extends AbstractServiceFactory<
  ListingEvent,
  ListingEventCreateDto,
  ListingEventUpdateDto
>(ListingEvent) {}
