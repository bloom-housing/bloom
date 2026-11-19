import { Prisma } from '@prisma/client';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { User } from '../dtos/users/user.dto';

/*
    this helps build the where clause for the list()
  */
export const buildWhereClause = (
  params: UserQueryParams,
  user: User,
): Prisma.UserAccountsWhereInput => {
  const filters: Prisma.UserAccountsWhereInput[] = [];

  if (params.search) {
    /*
        Every word must match either the first or last name,
        "first last" (in any order) narrows down to that user.
        Single characters (e.g. an initial in "John D") only match the start of a name,
      */
    const words = params.search.trim().split(/\s+/).filter(Boolean);

    const namesClause: Prisma.UserAccountsWhereInput[] = words.length
      ? [
          {
            AND: words.map((word) => {
              const match: Prisma.StringFilter =
                word.length > 1
                  ? { contains: word, mode: Prisma.QueryMode.insensitive }
                  : { startsWith: word, mode: Prisma.QueryMode.insensitive };
              return {
                OR: [{ firstName: match }, { lastName: match }],
              };
            }),
          },
        ]
      : [];

    filters.push({
      OR: [
        ...namesClause,
        {
          email: {
            contains: params.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          listings: {
            some: {
              name: {
                contains: params.search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          },
        },
      ],
    });
  }

  if (!params.filter?.length) {
    return {
      AND: filters,
    };
  }

  params.filter.forEach((filter) => {
    if (filter['isPortalUser']) {
      if (user?.userRoles?.isAdmin) {
        filters.push({
          OR: [
            {
              userRoles: {
                isPartner: true,
              },
            },
            {
              userRoles: {
                isAdmin: true,
              },
            },
            {
              userRoles: {
                isJurisdictionalAdmin: true,
              },
            },
            {
              userRoles: {
                isLimitedJurisdictionalAdmin: true,
              },
            },
            {
              userRoles: {
                isSupportAdmin: true,
              },
            },
          ],
        });
      } else if (user?.userRoles?.isJurisdictionalAdmin) {
        filters.push({
          OR: [
            {
              userRoles: {
                isPartner: true,
              },
            },
            {
              userRoles: {
                isJurisdictionalAdmin: true,
              },
            },
            {
              userRoles: {
                isLimitedJurisdictionalAdmin: true,
              },
            },
          ],
        });
        filters.push({
          jurisdictions: {
            some: {
              id: {
                in: user?.jurisdictions?.map((juris) => juris.id),
              },
            },
          },
        });
      }
    }

    if ('isAdvocateUser' in filter) {
      filters.push({
        AND: [
          {
            isAdvocate: filter['isAdvocateUser'],
          },
        ],
      });
    }

    if ('agencyId' in filter && filter['agencyId']) {
      filters.push({
        agencyId: filter['agencyId'],
      });
    }
  });
  return {
    AND: filters,
  };
};
