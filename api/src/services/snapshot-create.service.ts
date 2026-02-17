import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';

@Injectable()
export class SnapshotCreateService {
  constructor(private prisma: PrismaService) {}

  async createUserSnapshot(userId: string): Promise<SuccessDTO> {
    // grab current user account data
    const currData = await this.prisma.userAccounts.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        additionalPhoneExtension: true,
        additionalPhoneNumber: true,
        additionalPhoneNumberType: true,
        agreedToTermsOfService: true,
        confirmedAt: true,
        dob: true,
        email: true,
        firstName: true,
        hitConfirmationUrl: true,
        isAdvocate: true,
        isApproved: true,
        language: true,
        lastLoginAt: true,
        lastName: true,
        mfaEnabled: true,
        middleName: true,
        passwordHash: true,
        passwordUpdatedAt: true,
        passwordValidForDays: true,
        phoneExtension: true,
        phoneNumber: true,
        phoneNumberVerified: true,
        phoneType: true,
        title: true,
        wasWarnedOfDeletion: true,

        address: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            city: true,
            county: true,
            latitude: true,
            longitude: true,
            placeName: true,
            state: true,
            street: true,
            street2: true,
            zipCode: true,
          },
        },
        agency: {
          select: {
            id: true,
          },
        },
        jurisdictions: {
          select: {
            id: true,
          },
        },
        listings: {
          select: {
            id: true,
          },
        },
        userRoles: {
          select: {
            isAdmin: true,
            isJurisdictionalAdmin: true,
            isLimitedJurisdictionalAdmin: true,
            isPartner: true,
            isSuperAdmin: true,
            isSupportAdmin: true,
          },
        },
      },
    });

    if (!currData) {
      throw new InternalServerErrorException(
        `Snapshot was requested for user id: ${userId}, but that id does not exist`,
      );
    }

    // pull out the ancillary data, data we will ignore, and data that needs to be pulled out so it doesn't break the prisma call
    const {
      address,
      agency,
      jurisdictions,
      listings,
      userRoles,
      id,
      createdAt,
      ...rest
    } = currData;

    // create snapshot
    await this.prisma.userAccountSnapshot.create({
      data: {
        ...rest,
        originalId: id,
        originalCreatedAt: createdAt,
        address: address
          ? {
              create: {
                ...address,
                originalId: address.id,
                originalCreatedAt: address.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        agency: agency
          ? {
              connect: {
                id: agency.id,
              },
            }
          : undefined,
        jurisdiction: jurisdictions?.length
          ? {
              connect: jurisdictions.map((elem) => ({
                id: elem.id,
              })),
            }
          : undefined,
        userRole: userRoles
          ? {
              create: {
                ...userRoles,
              },
            }
          : undefined,
        listing: listings?.length
          ? {
              connect: listings.map((elem) => ({
                id: elem.id,
              })),
            }
          : undefined,
      },
    });

    return {
      success: true,
    };
  }
}
