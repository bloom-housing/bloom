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
