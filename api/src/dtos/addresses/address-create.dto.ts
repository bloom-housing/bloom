import { AddressUpdate } from './address-update.dto';
import { OmitType } from '@nestjs/swagger';

export class AddressCreate extends OmitType(AddressUpdate, ['id']) {}
