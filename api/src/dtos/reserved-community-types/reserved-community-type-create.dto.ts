import { OmitType } from '@nestjs/swagger';
import { ReservedCommunityType } from './reserved-community-type.dto';

export class ReservedCommunityTypeCreate extends OmitType(
  ReservedCommunityType,
  ['id', 'createdAt', 'updatedAt'],
) {}
