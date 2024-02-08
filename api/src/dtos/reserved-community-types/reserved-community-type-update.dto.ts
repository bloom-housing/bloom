import { OmitType } from '@nestjs/swagger';
import { ReservedCommunityType } from './reserved-community-type.dto';

export class ReservedCommunityTypeUpdate extends OmitType(
  ReservedCommunityType,
  ['createdAt', 'updatedAt', 'jurisdictions'],
) {}
