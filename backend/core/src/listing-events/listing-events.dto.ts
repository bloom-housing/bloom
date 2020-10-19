import { OmitType } from "@nestjs/swagger"
import { ListingEvent } from "../entity/listing-event.entity"

export class ListingEventDto extends OmitType(ListingEvent, ["listing"] as const) {}
