import { PropertyGroupCreateDto, PropertyGroupUpdateDto } from "./dto/property-group.dto"
import { PropertyGroup } from "./entities/property-group.entity"
import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PropertyGroupsService extends AbstractServiceFactory<
  PropertyGroup,
  PropertyGroupCreateDto,
  PropertyGroupUpdateDto
>(PropertyGroup) {}
