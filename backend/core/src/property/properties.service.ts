import { AbstractServiceFactory } from "../shared/services/abstract-service"
import { PropertyCreateDto, PropertyUpdateDto } from "./dto/property.dto"
import { Property } from "./entities/property.entity"

export class PropertiesService extends AbstractServiceFactory<
  Property,
  PropertyCreateDto,
  PropertyUpdateDto
>(Property) {}
