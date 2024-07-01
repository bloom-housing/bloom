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
    filters.push({
      OR: [
        {
          firstName: {
            contains: params.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          lastName: {
            contains: params.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
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
    } else if ('isPortalUser' in filter) {
      filters.push({
        AND: [
          {
            OR: [
              {
                userRoles: {
                  isPartner: null,
                },
              },
              {
                userRoles: {
                  isPartner: false,
                },
              },
            ],
          },
          {
            OR: [
              {
                userRoles: {
                  isLimitedJurisdictionalAdmin: null,
                },
              },
              {
                userRoles: {
                  isLimitedJurisdictionalAdmin: false,
                },
              },
            ],
          },
          {
            OR: [
              {
                userRoles: {
                  isJurisdictionalAdmin: null,
                },
              },
              {
                userRoles: {
                  isJurisdictionalAdmin: false,
                },
              },
            ],
          },
          {
            OR: [
              {
                userRoles: {
                  isAdmin: null,
                },
              },
              {
                userRoles: {
                  isAdmin: false,
                },
              },
            ],
          },
        ],
      });
    }
  });
  return {
    AND: filters,
  };
};
