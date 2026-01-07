import { ListingEventUpdate } from './listing-event-update.dto';
import { OmitType } from '@nestjs/swagger';

export class ListingEventCreate extends OmitType(ListingEventUpdate, ['id']) {}
