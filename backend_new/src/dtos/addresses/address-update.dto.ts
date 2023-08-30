import { OmitType } from '@nestjs/swagger';
import { Address } from './address-get.dto';

export class AddressUpdate extends OmitType(Address, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
