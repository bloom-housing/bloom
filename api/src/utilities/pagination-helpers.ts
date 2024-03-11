import { PaginationMeta } from '../dtos/shared/pagination.dto';

/*
  takes in the params for limit and page
  responds true if we should account for pagination
  responds false if we don't need to take pagination into account
*/
export const shouldPaginate = (limit: number | 'all', page: number) => {
  return limit !== 'all' && limit > 0 && page > 0;
};

/*
  takes in the params for limit and page
  responds with how many records we should skip over (if we are on page 2 we need to skip over page 1's records)
*/
export const calculateSkip = (limit?: number | 'all', page?: number) => {
  if (shouldPaginate(limit, page)) {
    return (page - 1) * (limit as number);
  }
  return 0;
};

/*
  takes in the params for limit and page
  responds with the # of records per page
  e.g. if limit is 10 that means each page should only contain 10 records
*/
export const calculateTake = (limit?: number | 'all') => {
  return limit !== 'all' ? limit : undefined;
};

interface paginationMetaParams {
  limit?: number | 'all';
  page?: number;
}

/*
  takes in params for limit and page, the results from the "count" query (the total number of records that meet whatever criteria) and the current "page" of record's length
  responds with the meta info needed for the pagination meta info section
*/
export const buildPaginationMetaInfo = (
  params: paginationMetaParams,
  count: number,
  recordArrayLength: number,
): PaginationMeta => {
  const isPaginated = shouldPaginate(params.limit, params.page);
  const itemsPerPage =
    isPaginated && params.limit !== 'all' ? params.limit : recordArrayLength;
  const totalItems = isPaginated ? count : recordArrayLength;

  const paginationInfo = {
    currentPage: isPaginated ? params.page : 1,
    itemCount: recordArrayLength,
    itemsPerPage: itemsPerPage,
    totalItems: totalItems,
    totalPages: Math.ceil(
      totalItems / (itemsPerPage ? itemsPerPage : totalItems),
    ),
  };

  return paginationInfo;
};
