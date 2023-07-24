import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma, UserAccounts, UserRoles } from '@prisma/client';
import { Compare } from '../dtos/shared/base-filter.dto';
import { UserFilterKeys } from '../enums/user_accounts/filter-key-enum';

type filter = {
  $comparison: Compare;
  $include_nulls: boolean;
  value: any;
  key: string;
  caseSensitive?: boolean;
};

/*
  This constructs the "where" part of a prisma query
  Because the where clause is specific to each model we are working with this has to be very generic.
  It only constructs the actual body of the where statement, how that clause is used must be managed by the service calling this helper function
*/
export function buildFilter(
  filter: filter,
  user?: UserAccounts & { roles: UserRoles },
): any {
  const toReturn = [];
  const comparison = filter['$comparison'];
  const includeNulls = filter['$include_nulls'];
  const filterValue = filter.value;
  const caseSensitive = filter.caseSensitive
    ? Prisma.QueryMode.default
    : Prisma.QueryMode.insensitive;

  if (filter.key === UserFilterKeys.isPortalUser) {
    // TODO: addIsPortalUserQuery(filter.value, user);
  }

  if (comparison === Compare.IN) {
    toReturn.push({
      in: String(filterValue)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => s.length !== 0),
      mode: caseSensitive,
    });
  } else if (comparison === Compare['<>']) {
    toReturn.push({
      not: {
        equals: filterValue,
      },
      mode: caseSensitive,
    });
  } else if (comparison === Compare['=']) {
    toReturn.push({
      equals: filterValue,
      mode: caseSensitive,
    });
  } else if (comparison === Compare['>=']) {
    toReturn.push({
      gte: filterValue,
      mode: caseSensitive,
    });
  } else if (comparison === Compare['<=']) {
    toReturn.push({
      lte: filterValue,
      mode: caseSensitive,
    });
  } else if (Compare.NA) {
    throw new HttpException(
      `Filter "${filter.key}" expected to be handled by a custom filter handler, but one was not implemented.`,
      HttpStatus.NOT_IMPLEMENTED,
    );
  } else {
    throw new HttpException(
      'Comparison Not Implemented',
      HttpStatus.NOT_IMPLEMENTED,
    );
  }

  if (includeNulls) {
    toReturn.push({
      equals: null,
    });
  }

  return toReturn;
}
