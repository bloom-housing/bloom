import { OmitType } from '@nestjs/swagger';
import { ReservedCommunityType } from './reserved-community-type-get.dto';

export class ReservedCommunitTypeCreate extends OmitType(
  ReservedCommunityType,
  ['id', 'createdAt', 'updatedAt'],
) {}
