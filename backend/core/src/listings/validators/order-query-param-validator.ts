import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator"
import { ListingsQueryParams } from "../dto/listings-query-params"

@ValidatorConstraint({ name: "order", async: false })
export class OrderQueryParamValidator implements ValidatorConstraintInterface {
  validate(order: Array<string> | undefined, args: ValidationArguments) {
    if (args.property === "order") {
      return Array.isArray(order)
        ? (args.object as ListingsQueryParams).orderBy?.length === order.length
        : false
    } else if (args.property === "orderBy") {
      return Array.isArray(order)
        ? (args.object as ListingsQueryParams).order?.length === order.length
        : false
    }
    return false
  }

  defaultMessage(args: ValidationArguments) {
    return "order array length must be equal to orderBy array length"
  }
}
