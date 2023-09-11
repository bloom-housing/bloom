import { ListingOrderByKeys } from '../enums/listings/order-by-enum';
import { OrderByEnum } from '../enums/shared/order-by-enum';
import { Prisma } from '@prisma/client';

/* 
  Constructs the "orderBy" part of the prisma query and maps the values to
  the appropriate listing field
*/
export const buildOrderByForListings = (
  orderBy?: string[],
  orderDir?: OrderByEnum[],
): Prisma.ListingsOrderByWithRelationInput[] => {
  if (!orderBy?.length) {
    return undefined;
  }

  return orderBy.map((param, index) => {
    switch (param) {
      case ListingOrderByKeys.mostRecentlyUpdated:
        return { updatedAt: orderDir[index] };
      case ListingOrderByKeys.status:
        return { status: orderDir[index] };
      case ListingOrderByKeys.name:
        return { name: orderDir[index] };
      case ListingOrderByKeys.waitlistOpen:
        return { isWaitlistOpen: orderDir[index] };
      case ListingOrderByKeys.unitsAvailable:
        return { unitsAvailable: orderDir[index] };
      case ListingOrderByKeys.mostRecentlyClosed:
        return {
          closedAt: orderDir[index],
        };
      case ListingOrderByKeys.mostRecentlyPublished:
        return {
          publishedAt: orderDir[index],
        };
      case ListingOrderByKeys.marketingType:
        return { marketingType: orderDir[index] };
      case ListingOrderByKeys.applicationDates:
      case undefined:
        // Default to ordering by applicationDates (i.e. applicationDueDate
        // and applicationOpenDate) if no orderBy param is specified.
        return { applicationDueDate: orderDir[index] };
    }
  }) as Prisma.ListingsOrderByWithRelationInput[];
};

/*
  This constructs the "orderBy" part of a prisma query
  We are guaranteed to have the same length for both the orderBy and orderDir arrays
*/
export const buildOrderBy = (orderBy?: string[], orderDir?: OrderByEnum[]) => {
  if (!orderBy?.length) {
    return undefined;
  }
  return orderBy.map((param, index) => ({
    [param]: orderDir[index],
  }));
};
