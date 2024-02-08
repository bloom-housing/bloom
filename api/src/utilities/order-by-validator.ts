import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

/*
  This is a custom validator to make sure the orderBy and orderDir arrays have the same length
*/
@ValidatorConstraint({ name: 'orderDir', async: false })
export class OrderQueryParamValidator implements ValidatorConstraintInterface {
  validate(order: Array<string> | undefined, args: ValidationArguments) {
    if (args.property === 'orderDir') {
      return Array.isArray(order)
        ? (args.object as { orderBy: Array<unknown> }).orderBy?.length ===
            order.length
        : false;
    } else if (args.property === 'orderBy') {
      return Array.isArray(order)
        ? (args.object as { orderDir: Array<unknown> }).orderDir?.length ===
            order.length
        : false;
    }
    return false;
  }

  defaultMessage() {
    return 'order array length must be equal to orderBy array length';
  }
}
