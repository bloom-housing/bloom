import { OmitType } from '@nestjs/swagger';
import { ListingUpdate } from './listing-update.dto';

export class ListingCreate extends OmitType(ListingUpdate, ['id']) {}
