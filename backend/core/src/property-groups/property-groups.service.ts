import { PropertyGroupCreateDto, PropertyGroupUpdateDto } from "./property-group.dto"
import { PropertyGroup } from "../entity/property-group.entity"
import { AbstractServiceFactory } from "../shared/abstract-service"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PropertyGroupsService extends AbstractServiceFactory<
  PropertyGroup,
  PropertyGroupCreateDto,
  PropertyGroupUpdateDto
>(PropertyGroup) {}
