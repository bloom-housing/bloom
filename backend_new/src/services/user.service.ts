import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import {
  buildPaginationMetaInfo,
  calculateSkip,
  calculateTake,
} from '../utilities/pagination-helpers';
import { buildOrderBy } from '../utilities/build-order-by';
import { Prisma } from '@prisma/client';
import { UserQueryParams } from '../dtos/users/user-query-param.dto';
import { PaginatedUserDto } from '../dtos/users/paginated-user.dto';
import { OrderByEnum } from '../enums/shared/order-by-enum';

/*
  this is the service for users
  it handles all the backend's business logic for reading/writing/deleting user data
*/

const view: Prisma.UserAccountsInclude = {
  listings: true,
  jurisdictions: true,
  userRoles: true,
};

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of users given the params passed in
  */
  async list(params: UserQueryParams, user: User): Promise<PaginatedUserDto> {
    const whereClause = this.buildWhereClause(params, user);
    const countQuery = this.prisma.userAccounts.count({
      where: whereClause,
    });

    const rawUsersQuery = this.prisma.userAccounts.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy(
        ['firstName', 'lastName'],
        [OrderByEnum.ASC, OrderByEnum.ASC],
      ),
      include: view,
      where: whereClause,
    });

    const [count, rawUsers] = await Promise.all([countQuery, rawUsersQuery]);

    const users = mapTo(User, rawUsers);

    const paginationInfo = buildPaginationMetaInfo(params, count, users.length);

    return {
      items: users,
      meta: paginationInfo,
    };
  }

  /*
    this helps build the where clause for the list()
  */
  buildWhereClause(
    params: UserQueryParams,
    user: User,
  ): Prisma.UserAccountsWhereInput {
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
      if ('isPortalUser' in filter && filter['isPortalUser']) {
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
  }

  /*
    this will return 1 user or error
  */
  async findOne(userId: string): Promise<User> {
    const rawUser = await this.prisma.userAccounts.findFirst({
      include: view,
      where: {
        id: {
          equals: userId,
        },
      },
    });

    if (!rawUser) {
      throw new NotFoundException(
        `userId ${userId} was requested but not found`,
      );
    }

    return mapTo(User, rawUser);
  }
}
