import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"
import { ReservedCommunityType } from "./entities/reserved-community-type.entity"
import {
  ReservedCommunityTypeCreateDto,
  ReservedCommunityTypeUpdateDto,
} from "./dto/reserved-community-type.dto"

@Injectable()
export class ReservedCommunityTypesService extends AbstractServiceFactory<
  ReservedCommunityType,
  ReservedCommunityTypeCreateDto,
  ReservedCommunityTypeUpdateDto
>(ReservedCommunityType) {}
