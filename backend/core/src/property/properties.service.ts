import { AbstractServiceFactory } from "../shared/abstract-service"
import { PropertyCreateDto, PropertyUpdateDto } from "./property.dto"
import { Property } from "../entity/property.entity"

export class PropertiesService extends AbstractServiceFactory<
  Property,
  PropertyCreateDto,
  PropertyUpdateDto
>(Property) {}
