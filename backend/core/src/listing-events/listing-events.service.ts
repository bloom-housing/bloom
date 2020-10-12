import { plainToClass } from "class-transformer"
import { ListingEvent } from "../entity/listing-event.entity"
import { ListingEventCreateDto } from "./listing-events.create.dto"
import { ListingEventUpdateDto } from "./listing-events.update.dto"

export class ListingEventsService {
  async list(): Promise<ListingEvent[]> {
    return ListingEvent.find()
  }

  async create(listingEventDto: ListingEventCreateDto): Promise<ListingEvent> {
    const listingEvent = plainToClass(ListingEvent, listingEventDto)
    await listingEvent.save()
    return listingEvent
  }

  async findOne(listingEventId: string): Promise<ListingEvent> {
    return ListingEvent.findOneOrFail({
      where: {
        id: listingEventId,
      },
    })
  }

  async delete(listingEventId: string) {
    await ListingEvent.delete(listingEventId)
  }

  async update(listingEventDto: ListingEventUpdateDto) {
    const listingEvent = await ListingEvent.findOneOrFail({
      where: {
        id: listingEventDto.id,
      },
    })
    Object.assign(listingEvent, listingEventDto)
    await listingEvent.save()
    return listingEvent
  }
}
