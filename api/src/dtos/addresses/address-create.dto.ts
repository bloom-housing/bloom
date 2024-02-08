import { OmitType } from '@nestjs/swagger';
import { Address } from './address.dto';

export class AddressCreate extends OmitType(Address, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
