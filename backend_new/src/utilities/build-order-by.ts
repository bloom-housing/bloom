import { OrderByEnum } from '../enums/shared/order-by-enum';

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
