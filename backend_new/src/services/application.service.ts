import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Application } from '../dtos/applications/application-get.dto';
import { mapTo } from '../utilities/mapTo';
import { ApplicationQueryParams } from '../dtos/applications/application-query-params.dto';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { Prisma } from '@prisma/client';
import { buildOrderBy } from '../utilities/build-order-by';
import { buildPaginationInfo } from '../utilities/build-pagination-meta';

const view: Record<string, Prisma.ApplicationsInclude> = {
  partnerList: {
    applicant: {
      include: {
        applicantAddress: true,
        applicantWorkAddress: true,
      },
    },
    householdMember: true,
    accessibility: true,
    applicationsMailingAddress: true,
    applicationsAlternateAddress: true,
    alternateContact: {
      include: {
        address: true,
      },
    },
  },
};

view.base = {
  ...view.partnerList,
  demographics: true,
  preferredUnitTypes: true,
  householdMember: {
    include: {
      householdMemberAddress: true,
      householdMemberWorkAddress: true,
    },
  },
};

/*
  this is the service for applicationss
  it handles all the backend's business logic for reading/writing/deleting application data
*/
@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  /*
    this will get a set of applications given the params passed in
    this set can either be paginated or not depending on the params
    it will return both the set of applications, and some meta information to help with pagination
  */
  async list(params: ApplicationQueryParams) {
    const whereClause = this.buildWhereClause(params);

    const count = await this.prisma.applications.count({
      where: whereClause,
    });

    const rawApplications = await this.prisma.applications.findMany({
      skip: calculateSkip(params.limit, params.page),
      take: calculateTake(params.limit),
      orderBy: buildOrderBy([params.orderBy], [params.order]),
      include: view[params.listingId ? 'partnerList' : 'base'],
      where: whereClause,
    });

    const applications = mapTo(Application, rawApplications);

    const promiseArray = applications.map((application) =>
      this.getDuplicateFlagsForApplication(application.id),
    );

    const flags = await Promise.all(promiseArray);
    applications.forEach((application, index) => {
      application.flagged = !!flags[index]?.id;
    });

    return {
      items: applications,
      meta: buildPaginationInfo(
        params.limit,
        params.page,
        count,
        applications.length,
      ),
    };
  }

  /*
    this builds the where clause for list()
  */
  buildWhereClause(
    params: ApplicationQueryParams,
  ): Prisma.ApplicationsWhereInput {
    const toReturn: Prisma.ApplicationsWhereInput[] = [];

    if (params.userId) {
      toReturn.push({
        userAccounts: {
          id: params.userId,
        },
      });
    }
    if (params.listingId) {
      toReturn.push({
        listingId: params.listingId,
      });
    }
    if (params.search) {
      toReturn.push({
        OR: [
          {
            confirmationCode: { contains: params.search, mode: 'insensitive' },
          },
          {
            applicant: {
              firstName: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            applicant: {
              lastName: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            applicant: {
              emailAddress: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            applicant: {
              phoneNumber: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            alternateContact: {
              firstName: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            alternateContact: {
              lastName: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            alternateContact: {
              emailAddress: { contains: params.search, mode: 'insensitive' },
            },
          },
          {
            alternateContact: {
              phoneNumber: { contains: params.search, mode: 'insensitive' },
            },
          },
        ],
      });
    }
    if (params.markedAsDuplicate !== undefined) {
      toReturn.push({
        markedAsDuplicate: params.markedAsDuplicate,
      });
    }
    return {
      AND: toReturn,
    };
  }

  /*
    this is to calculate the `flagged` property of an application
    ideally in the future we save this data on the application so we don't have to keep
    recalculating it
  */
  async getDuplicateFlagsForApplication(applicationId: string) {
    return this.prisma.applications.findFirst({
      select: {
        id: true,
      },
      where: {
        id: applicationId,
        applicationFlaggedSet: {
          some: {},
        },
      },
    });
  }

  /*
    this will return 1 application or error
  */
  async findOne(applicationId: string) {
    const rawApplication = await this.prisma.applications.findFirst({
      where: {
        id: {
          equals: applicationId,
        },
      },
      include: {
        userAccounts: true,
        applicant: {
          include: {
            applicantAddress: true,
            applicantWorkAddress: true,
          },
        },
        applicationsMailingAddress: true,
        applicationsAlternateAddress: true,
        alternateContact: {
          include: {
            address: true,
          },
        },
        accessibility: true,
        demographics: true,
        householdMember: {
          include: {
            householdMemberAddress: true,
            householdMemberWorkAddress: true,
          },
        },
        preferredUnitTypes: true,
      },
    });

    if (!rawApplication) {
      throw new NotFoundException();
    }

    return mapTo(Application, rawApplication);
  }

  /*
    this will create an application
  */
  async create(incomingData: any) {
    // TODO
  }

  /*
    this will update an application
    if no application has the id of the incoming argument an error is thrown
  */
  async update(incomingData: any) {
    // TODO
  }

  /*
    this will delete an application
  */
  async delete(applicationId: string) {
    // TODO
  }
}
