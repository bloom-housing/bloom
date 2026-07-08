import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ListingsStatusEnum, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { ExternalizedDetails } from '../dtos/external-listings/externalized-details.dto';
import { IngestParams } from '../dtos/external-listings/ingest-params.dto';
import Listing from '../dtos/listings/listing.dto';
import { IdDTO } from '../dtos/shared/id.dto';

dayjs.extend(utc);

/**
  this is the service for external listings
  it handles all the backend's business logic for exposing and ingesting listings
*/
@Injectable()
export class ExternalListingService {
  constructor(
    private httpService: HttpService,
    private prisma: PrismaService,
    @Inject(Logger)
    private logger = new Logger(ExternalListingService.name),
  ) {}

  async externalize(): Promise<ExternalizedDetails> {
    const jurisdictions = await this.prisma.jurisdictions.findMany({
      select: { id: true, name: true },
    });
    const listings = await this.prisma.listings.findMany({
      select: { id: true, contentUpdatedAt: true, jurisdictionId: true },
      where: { externalListingId: null, status: ListingsStatusEnum.active },
    });
    const reservedCommunityTypes =
      await this.prisma.reservedCommunityTypes.findMany({
        select: { id: true, name: true },
      });
    const unitRentTypes = await this.prisma.unitRentTypes.findMany({
      select: { id: true, name: true },
    });
    const unitTypes = await this.prisma.unitTypes.findMany({
      select: { id: true, name: true },
    });

    const externalizedDetails: ExternalizedDetails = {
      jurisdictions,
      listings,
      reservedCommunityTypes,
      unitRentTypes,
      unitTypes,
    };

    return externalizedDetails;
  }

  async ingest(ingestParams: IngestParams) {
    const { externalURL, jurisdictionId, targetName } = ingestParams;

    // fetch the externalized data from the external system
    const { data } = await firstValueFrom(
      this.httpService
        .get<ExternalizedDetails>(`${externalURL}/externalListings`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Request to external Bloom instance with URL ${externalURL} failed`,
              error,
            );
            throw new HttpException('External details call failed', 500);
          }),
        ),
    );

    const {
      jurisdictions = [],
      listings = [],
      reservedCommunityTypes = [],
      unitRentTypes = [],
      unitTypes = [],
    } = data;
    const externalJurisdiction = jurisdictions.find(
      (juris) => juris.name === targetName,
    );

    if (!externalJurisdiction) {
      this.logger.error(
        `Target jurisdiction ${targetName} not found when calling URL ${externalURL}`,
        jurisdictions.toString(),
      );
      throw new HttpException('Target jurisdiction not found', 500);
    }

    let listingIdsToDelete = [];

    // query for existing external listings within the system
    const currentExternalListings = await this.prisma.listings.findMany({
      select: { id: true, contentUpdatedAt: true, externalListingId: true },
      where: {
        externalJurisdictionId: externalJurisdiction.id,
        jurisdictionId: jurisdictionId,
      },
    });

    if (listings.length === 0) {
      listingIdsToDelete = currentExternalListings.map((listing) => listing.id);
    } else {
      // query and compare reserved community types
      const internalReservedCommunityTypes =
        await this.prisma.reservedCommunityTypes.findMany({
          select: { id: true, name: true },
        });

      const combinedRCTs = reservedCommunityTypes.reduce((acc, rct) => {
        const matchingRCT = internalReservedCommunityTypes.find(
          (internalRCT) => internalRCT.name === rct.name,
        );
        if (matchingRCT) {
          acc.push({ internalId: matchingRCT.id, externalId: rct.id });
        } else {
          this.logger.error(
            `External reserved community type ${rct.name} could not be matched`,
          );
        }
        return acc;
      }, []);

      // query and compare unit rent types
      const internalUnitRentTypes = await this.prisma.unitRentTypes.findMany({
        select: { id: true, name: true },
      });

      const combinedURTs = unitRentTypes.reduce((acc, urt) => {
        const matchingURT = internalUnitRentTypes.find(
          (internalUnitRentType) => internalUnitRentType.name === urt.name,
        );
        if (matchingURT) {
          acc.push({ internalId: matchingURT.id, externalId: urt.id });
        } else {
          this.logger.error(
            `External unit rent type ${urt.name} could not be matched`,
          );
        }
        return acc;
      }, []);

      // query and compare unit types
      const internalUnitTypes = await this.prisma.unitTypes.findMany({
        select: { id: true, name: true },
      });

      const combinedUTs = unitTypes.reduce((acc, unitType) => {
        const matchingUT = internalUnitTypes.find(
          (internalUnitType) => internalUnitType.name === unitType.name,
        );
        if (matchingUT) {
          acc.push({ internalId: matchingUT.id, externalId: unitType.id });
        } else {
          this.logger.error(
            `External unit type ${unitType.name} could not be matched`,
          );
        }
        return acc;
      }, []);

      for (const existingListing of currentExternalListings) {
        const index = listings.findIndex(
          (listing) => listing?.id === existingListing.externalListingId,
        );

        if (index >= 0) {
          const externalListing = listings.at(index);
          delete listings[index];

          if (
            dayjs
              .utc(existingListing.contentUpdatedAt)
              .isBefore(dayjs.utc(externalListing.contentUpdatedAt))
          ) {
            // delete existing listing
            await this.prisma.listings.delete({
              where: { id: existingListing.id },
            });
            // recreate with updated data
            this.createExternalListing(
              combinedRCTs,
              combinedURTs,
              combinedUTs,
              externalJurisdiction,
              externalListing,
              externalURL,
              jurisdictionId,
            );
          } else {
            continue;
          }
        } else {
          // add to list for deletion
          listingIdsToDelete.push(existingListing.id);
        }
      }

      for (const newExternalListing of listings) {
        if (
          newExternalListing &&
          newExternalListing.jurisdictionId === externalJurisdiction.id
        ) {
          // create newly active listings
          this.createExternalListing(
            combinedRCTs,
            combinedURTs,
            combinedUTs,
            externalJurisdiction,
            newExternalListing,
            externalURL,
            jurisdictionId,
          );
        } else {
          continue;
        }
      }
    }

    if (listingIdsToDelete.length > 0) {
      // delete all listings that are no longer active
      await this.prisma.listings.deleteMany({
        where: {
          id: {
            in: listingIdsToDelete,
          },
        },
      });
    }

    return {
      success: true,
    };
  }

  async createExternalListing(
    combinedRCTs: Array<any>,
    combinedURTs: Array<any>,
    combinedUTs: Array<any>,
    externalJurisdiction: IdDTO,
    externalListing: IdDTO,
    externalURL: string,
    jurisdictionId: string,
  ) {
    // fetch the full data for the external listing
    const { data } = await firstValueFrom(
      this.httpService
        .get<Listing>(`${externalURL}/listings/${externalListing.id}?view=base`)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(
              `Request to external Bloom instance with URL ${externalURL} for listing ${externalListing.id} failed`,
              error,
            );
            throw new HttpException('External listing fetch call failed', 500);
          }),
        ),
    );

    if (data === null || data === undefined) {
      this.logger.error(
        `Listing with external id ${externalListing.id} could not be created. Endpoint returned null.`,
      );
      return;
    }

    let reservedCommunityTypeId: string;
    if (data.reservedCommunityTypes) {
      reservedCommunityTypeId = combinedRCTs.find(
        (rct) => rct.externalId === data.reservedCommunityTypes.id,
      )?.internalId;

      if (reservedCommunityTypeId === undefined) {
        this.logger.error(
          `Listing with external id ${externalListing.id} could not be created. Reserved community type ${data.reservedCommunityTypes.name} does not exist.`,
        );
        return;
      }
    }

    await this.prisma.listings.create({
      data: {
        accessibility: data.accessibility,
        additionalApplicationSubmissionNotes:
          data.additionalApplicationSubmissionNotes,
        allowsCats: data.allowsCats,
        allowsDogs: data.allowsDogs,
        amenities: data.amenities,
        applicationDueDate: data.applicationDueDate,
        applicationFee: data.applicationFee,
        applicationOpenDate: data.applicationOpenDate,
        applicationOrganization: data.applicationOrganization,
        buildingTotalUnits: data.buildingTotalUnits,
        cocInfo: data.cocInfo,
        commonDigitalApplication: data.commonDigitalApplication,
        communityDisclaimerDescription: data.communityDisclaimerDescription,
        communityDisclaimerTitle: data.communityDisclaimerTitle,
        configurableRegion: data.configurableRegion,
        contentUpdatedAt: data.contentUpdatedAt,
        costsNotIncluded: data.costsNotIncluded,
        creditHistory: data.creditHistory,
        creditScreeningFee: data.creditScreeningFee,
        criminalBackground: data.criminalBackground,
        customMapPin: data.customMapPin,
        depositHelperText: data.depositHelperText,
        depositMax: data.depositMax,
        depositMin: data.depositMin,
        depositType: data.depositType,
        depositValue: data.depositValue,
        developer: data.developer,
        digitalApplication: data.digitalApplication,
        disableUnitsAccordion: data.disableUnitsAccordion,
        displayWaitlistSize: data.displayWaitlistSize,
        externalJurisdictionId: externalJurisdiction.id,
        externalListingId: externalListing.id,
        externalURL: externalURL,
        hasHudEbllClearance: data.hasHudEbllClearance,
        homeType: data.homeType,
        householdSizeMax: data.householdSizeMax,
        householdSizeMin: data.householdSizeMin,
        includeCommunityDisclaimer: data.includeCommunityDisclaimer,
        isVerified: data.isVerified,
        isWaitlistOpen: data.isWaitlistOpen,
        leasingAgentEmail: data.leasingAgentEmail,
        leasingAgentName: data.leasingAgentName,
        leasingAgentOfficeHours: data.leasingAgentOfficeHours,
        leasingAgentPhone: data.leasingAgentPhone,
        leasingAgentTitle: data.leasingAgentTitle,
        listingFileNumber: data.listingFileNumber,
        listingType: data.listingType,
        lotteryOptIn: data.lotteryOptIn,
        managementWebsite: data.managementWebsite,
        marketingMonth: data.marketingMonth,
        marketingSeason: data.marketingSeason,
        marketingType: data.marketingType,
        marketingYear: data.marketingYear,
        name: data.name,
        neighborhood: data.neighborhood,
        paperApplication: data.paperApplication,
        parkingFee: data.parkingFee,
        petPolicy: data.petPolicy,
        postmarkedApplicationsReceivedByDate:
          data.postmarkedApplicationsReceivedByDate,
        programRules: data.programRules,
        publishedAt: data.publishedAt,
        referralOpportunity: data.referralOpportunity,
        rentalAssistance: data.rentalAssistance,
        rentalHistory: data.rentalHistory,
        reservedCommunityDescription: data.reservedCommunityDescription,
        reservedCommunityMinAge: data.reservedCommunityMinAge,
        reviewOrderType: data.reviewOrderType,
        scheduledPublishAt: data.scheduledPublishAt,
        scheduledApplicationOpenAt: data.scheduledApplicationOpenAt,
        section8Acceptance: data.section8Acceptance,
        servicesOffered: data.servicesOffered,
        smokingPolicy: data.smokingPolicy,
        specialNotes: data.specialNotes,
        status: data.status,
        unitAmenities: data.unitAmenities,
        unitsAvailable: data.unitsAvailable,
        waitlistCurrentSize: data.waitlistCurrentSize,
        waitlistMaxSize: data.waitlistMaxSize,
        waitlistOpenSpots: data.waitlistOpenSpots,
        whatToExpect: data.whatToExpect,
        whatToExpectAdditionalText: data.whatToExpectAdditionalText,
        yearBuilt: data.yearBuilt,

        assets: data.assets
          ? {
              create: data.assets.map((asset) => ({
                fileId: asset.fileId,
                label: asset.label,
              })),
            }
          : Prisma.JsonNullValueInput.JsonNull,
        jurisdictions: {
          connect: {
            id: jurisdictionId,
          },
        },
        listingImages: data.listingImages
          ? {
              create: data.listingImages.map((image) => ({
                assets: {
                  create: {
                    fileId: image.assets.fileId,
                    label: image.assets.label,
                  },
                },
                ordinal: image.ordinal,
                description: image.description,
              })),
            }
          : undefined,
        listingsBuildingAddress: data.listingsBuildingAddress
          ? {
              create: {
                ...data.listingsBuildingAddress,
                id: undefined,
              },
            }
          : undefined,
        reservedCommunityTypes: reservedCommunityTypeId
          ? {
              connect: {
                id: reservedCommunityTypeId,
              },
            }
          : undefined,
        unitGroups: data.unitGroups
          ? {
              create: data.unitGroups.map((group) => ({
                bathroomMax: group.bathroomMax,
                bathroomMin: group.bathroomMin,
                floorMax: group.floorMax,
                floorMin: group.floorMin,
                maxOccupancy: group.maxOccupancy,
                minOccupancy: group.minOccupancy,
                openWaitlist: group.openWaitlist,
                sqFeetMax: group.sqFeetMax,
                sqFeetMin: group.sqFeetMin,
                rentType: group.rentType,
                flatRentValueFrom: group.flatRentValueFrom,
                flatRentValueTo: group.flatRentValueTo,
                monthlyRent: group.monthlyRent,
                totalAvailable: group.totalAvailable,
                totalCount: group.totalCount,
                accessibilityPriorityType: group.accessibilityPriorityType,
                unitGroupAmiLevels: undefined,
                unitTypes: {
                  connect: group.unitTypes.map((type) => ({
                    id: combinedUTs.find(
                      (unitType) => unitType.externalId === type.id,
                    )?.internalId,
                  })),
                },
              })),
            }
          : undefined,
        units: data.units
          ? {
              create: data.units.map((unit) => ({
                accessibilityPriorityType: unit.accessibilityPriorityType,
                amiPercentage: unit.amiPercentage,
                annualIncomeMax: unit.annualIncomeMax,
                annualIncomeMin: unit.annualIncomeMin,
                bmrProgramChart: unit.bmrProgramChart,
                floor: unit.floor,
                maxOccupancy: unit.maxOccupancy,
                minOccupancy: unit.minOccupancy,
                monthlyIncomeMin: unit.monthlyIncomeMin,
                monthlyRent: unit.monthlyRent,
                monthlyRentAsPercentOfIncome: unit.monthlyRentAsPercentOfIncome,
                numBedrooms: unit.numBedrooms,
                numBathrooms: unit.numBathrooms,
                number: unit.number,
                sqFeet: unit.sqFeet,

                amiChart: undefined,
                unitAmiChartOverrides: undefined,
                unitRentTypes: unit.unitRentTypes
                  ? {
                      connect: {
                        id: combinedURTs.find(
                          (unitRentType) =>
                            unitRentType.externalId === unit.unitRentTypes.id,
                        )?.internalId,
                      },
                    }
                  : undefined,
                unitTypes: unit.unitTypes
                  ? {
                      connect: {
                        id: combinedUTs.find(
                          (unitType) =>
                            unitType.externalId === unit.unitTypes.id,
                        )?.internalId,
                      },
                    }
                  : undefined,
              })),
            }
          : undefined,
      },
    });
  }
}
