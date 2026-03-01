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

  async createListingSnapshot(listingId: string): Promise<SuccessDTO> {
    // grab current listing data
    const currData = await this.prisma.listings.findUnique({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        accessibility: true,
        accessibleMarketingFlyer: true,
        additionalApplicationSubmissionNotes: true,
        allowsCats: true,
        allowsDogs: true,
        amenities: true,
        amiPercentageMax: true,
        amiPercentageMin: true,
        applicationDropOffAddressOfficeHours: true,
        applicationDropOffAddressType: true,
        applicationDueDate: true,
        applicationFee: true,
        applicationMailingAddressType: true,
        applicationOpenDate: true,
        applicationOrganization: true,
        applicationPickUpAddressOfficeHours: true,
        applicationPickUpAddressType: true,
        assets: true,
        buildingSelectionCriteria: true,
        buildingTotalUnits: true,
        closedAt: true,
        cocInfo: true,
        commonDigitalApplication: true,
        communityDisclaimerDescription: true,
        communityDisclaimerTitle: true,
        configurableRegion: true,
        contentUpdatedAt: true,
        costsNotIncluded: true,
        creditHistory: true,
        creditScreeningFee: true,
        criminalBackground: true,
        customMapPin: true,
        depositHelperText: true,
        depositMax: true,
        depositMin: true,
        depositType: true,
        depositValue: true,
        developer: true,
        digitalApplication: true,
        disableUnitsAccordion: true,
        displayWaitlistSize: true,
        hasHudEbllClearance: true,
        homeType: true,
        householdSizeMax: true,
        householdSizeMin: true,
        hrdId: true,
        includeCommunityDisclaimer: true,
        isVerified: true,
        isWaitlistOpen: true,
        leasingAgentEmail: true,
        leasingAgentName: true,
        leasingAgentOfficeHours: true,
        leasingAgentPhone: true,
        leasingAgentTitle: true,
        listingFileNumber: true,
        listingType: true,
        lotteryLastPublishedAt: true,
        lotteryLastRunAt: true,
        lotteryOptIn: true,
        lotteryStatus: true,
        managementCompany: true,
        managementWebsite: true,
        marketingFlyer: true,
        marketingMonth: true,
        marketingSeason: true,
        marketingType: true,
        marketingYear: true,
        name: true,
        neighborhood: true,
        ownerCompany: true,
        paperApplication: true,
        parkingFee: true,
        petPolicy: true,
        phoneNumber: true,
        postmarkedApplicationsReceivedByDate: true,
        programRules: true,
        publishedAt: true,
        referralOpportunity: true,
        region: true,
        rentalAssistance: true,
        rentalHistory: true,
        requestedChanges: true,
        requestedChangesDate: true,
        requiredDocuments: true,
        reservedCommunityDescription: true,
        reservedCommunityMinAge: true,
        resultLink: true,
        reviewOrderType: true,
        section8Acceptance: true,
        servicesOffered: true,
        smokingPolicy: true,
        specialNotes: true,
        status: true,
        temporaryListingId: true,
        unitAmenities: true,
        unitsAvailable: true,
        verifiedAt: true,
        waitlistCurrentSize: true,
        waitlistMaxSize: true,
        waitlistOpenSpots: true,
        wasCreatedExternally: true,
        whatToExpect: true,
        whatToExpectAdditionalText: true,
        yearBuilt: true,

        applicationMethods: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            acceptsPostmarkedApplications: true,
            externalReference: true,
            label: true,
            phoneNumber: true,
            type: true,
            paperApplications: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                language: true,
                assets: {
                  select: {
                    id: true,
                    createdAt: true,
                    updatedAt: true,
                    fileId: true,
                    label: true,
                  },
                },
              },
            },
          },
        },
        jurisdictions: {
          select: {
            id: true,
          },
        },
        reservedCommunityTypes: {
          select: {
            id: true,
          },
        },
        listingFeatures: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            accessibleHeightToilet: true,
            accessibleParking: true,
            acInUnit: true,
            barrierFreeBathroom: true,
            barrierFreeEntrance: true,
            barrierFreePropertyEntrance: true,
            barrierFreeUnitEntrance: true,
            bathGrabBarsOrReinforcements: true,
            bathroomCounterLowered: true,
            brailleSignageInBuilding: true,
            carbonMonoxideDetectorWithStrobe: true,
            carpetInUnit: true,
            elevator: true,
            extraAudibleCarbonMonoxideDetector: true,
            extraAudibleSmokeDetector: true,
            fireSuppressionSprinklerSystem: true,
            frontControlsDishwasher: true,
            frontControlsStoveCookTop: true,
            grabBars: true,
            hardFlooringInUnit: true,
            hearing: true,
            hearingAndVision: true,
            heatingInUnit: true,
            inUnitWasherDryer: true,
            kitchenCounterLowered: true,
            laundryInBuilding: true,
            leverHandlesOnDoors: true,
            leverHandlesOnFaucets: true,
            loweredCabinets: true,
            loweredLightSwitch: true,
            mobility: true,
            noEntryStairs: true,
            nonDigitalKitchenAppliances: true,
            noStairsToParkingSpots: true,
            noStairsWithinUnit: true,
            parkingOnSite: true,
            refrigeratorWithBottomDoorFreezer: true,
            rollInShower: true,
            serviceAnimalsAllowed: true,
            smokeDetectorWithStrobe: true,
            streetLevelEntrance: true,
            toiletGrabBarsOrReinforcements: true,
            ttyAmplifiedPhone: true,
            turningCircleInBathrooms: true,
            visual: true,
            walkInShower: true,
            wheelchairRamp: true,
            wideDoorways: true,
          },
        },
        listingNeighborhoodAmenities: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            busStops: true,
            groceryStores: true,
            healthCareResources: true,
            hospitals: true,
            parksAndCommunityCenters: true,
            pharmacies: true,
            playgrounds: true,
            publicTransportation: true,
            recreationalFacilities: true,
            schools: true,
            seniorCenters: true,
            shoppingVenues: true,
          },
        },
        listingsApplicationDropOffAddress: {
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
        listingsApplicationMailingAddress: {
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
        listingsApplicationPickUpAddress: {
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
        listingsBuildingAddress: {
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
        listingsLeasingAgentAddress: {
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
        listingsAccessibleMarketingFlyerFile: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            fileId: true,
            label: true,
          },
        },
        listingsBuildingSelectionCriteriaFile: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            fileId: true,
            label: true,
          },
        },
        listingsMarketingFlyerFile: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            fileId: true,
            label: true,
          },
        },
        listingsResult: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            fileId: true,
            label: true,
          },
        },
        listingMultiselectQuestions: {
          select: {
            multiselectQuestionId: true,
            ordinal: true,
          },
        },
        listingUtilities: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            cable: true,
            electricity: true,
            gas: true,
            internet: true,
            phone: true,
            sewer: true,
            trash: true,
            water: true,
          },
        },
        listingImages: {
          select: {
            assets: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                fileId: true,
                label: true,
              },
            },
            description: true,
            ordinal: true,
          },
        },
        listingEvents: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            endTime: true,
            label: true,
            note: true,
            startDate: true,
            startTime: true,
            type: true,
            url: true,
            assets: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                fileId: true,
                label: true,
              },
            },
          },
        },
        property: {
          select: {
            id: true,
          },
        },
        requiredDocumentsList: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            birthCertificate: true,
            currentLandlordReference: true,
            governmentIssuedId: true,
            previousLandlordReference: true,
            proofOfAssets: true,
            proofOfCustody: true,
            proofOfIncome: true,
            residencyDocuments: true,
            socialSecurityCard: true,
          },
        },
        unitGroups: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            bathroomMax: true,
            bathroomMin: true,
            flatRentValueFrom: true,
            flatRentValueTo: true,
            floorMax: true,
            floorMin: true,
            maxOccupancy: true,
            minOccupancy: true,
            monthlyRent: true,
            openWaitlist: true,
            accessibilityPriorityType: true,
            rentType: true,
            sqFeetMax: true,
            sqFeetMin: true,
            totalAvailable: true,
            totalCount: true,
            unitGroupAmiLevels: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                amiPercentage: true,
                flatRentValue: true,
                monthlyRentDeterminationType: true,
                percentageOfIncomeValue: true,
                amiChart: {
                  select: {
                    id: true,
                  },
                },
              },
            },
            unitTypes: {
              select: {
                id: true,
              },
            },
          },
        },
        units: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            amiPercentage: true,
            annualIncomeMax: true,
            annualIncomeMin: true,
            bmrProgramChart: true,
            floor: true,
            maxOccupancy: true,
            minOccupancy: true,
            monthlyIncomeMin: true,
            monthlyRent: true,
            monthlyRentAsPercentOfIncome: true,
            numBathrooms: true,
            numBedrooms: true,
            number: true,
            accessibilityPriorityType: true,
            sqFeet: true,
            status: true,
            amiChart: {
              select: {
                id: true,
              },
            },
            unitAmiChartOverrides: {
              select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                items: true,
              },
            },
            unitRentTypes: {
              select: {
                id: true,
              },
            },
            unitTypes: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!currData) {
      throw new InternalServerErrorException(
        `Snapshot was requested for listing id: ${listingId}, but that id does not exist`,
      );
    }

    // pull out the ancillary data, data we will ignore, and data that needs to be pulled out so it doesn't break the prisma call
    const {
      id,
      createdAt,
      applicationMethods,
      jurisdictions,
      listingEvents,
      listingFeatures,
      listingImages,
      listingMultiselectQuestions,
      listingNeighborhoodAmenities,
      listingsAccessibleMarketingFlyerFile,
      listingsApplicationDropOffAddress,
      listingsApplicationMailingAddress,
      listingsApplicationPickUpAddress,
      listingsBuildingAddress,
      listingsBuildingSelectionCriteriaFile,
      listingsLeasingAgentAddress,
      listingsMarketingFlyerFile,
      listingsResult,
      listingUtilities,
      property,
      requiredDocumentsList,
      reservedCommunityTypes,
      unitGroups,
      units,
      ...rest
    } = currData;

    // create snapshot
    await this.prisma.listingSnapshot.create({
      data: {
        ...rest,
        originalId: id,
        originalCreatedAt: createdAt,

        applicationMethod: applicationMethods?.length
          ? {
              create: applicationMethods.map((am) => {
                const { paperApplications, ...rest } = am;
                return {
                  ...rest,
                  originalId: rest.id,
                  originalCreatedAt: rest.createdAt,
                  id: undefined,
                  createdAt: undefined,
                  paperApplication: paperApplications?.length
                    ? {
                        create: paperApplications.map((pa) => {
                          const { assets, ...remainder } = pa;
                          return {
                            ...remainder,
                            originalId: remainder.id,
                            originalCreatedAt: remainder.createdAt,
                            id: undefined,
                            createdAt: undefined,
                            asset: assets
                              ? {
                                  create: {
                                    originalId: assets.id,
                                    originalCreatedAt: assets.createdAt,
                                    updatedAt: assets.updatedAt,
                                    fileId: assets.fileId,
                                    label: assets.label,
                                  },
                                }
                              : undefined,
                          };
                        }),
                      }
                    : undefined,
                };
              }),
            }
          : undefined,
        jurisdiction: jurisdictions
          ? {
              connect: {
                id: jurisdictions.id,
              },
            }
          : undefined,
        listingEvent: listingEvents?.length
          ? {
              create: listingEvents.map((le) => {
                const { assets, ...remainder } = le;
                return {
                  ...remainder,
                  originalId: remainder.id,
                  originalCreatedAt: remainder.createdAt,
                  id: undefined,
                  createdAt: undefined,
                  asset: assets
                    ? {
                        create: {
                          ...assets,
                          originalId: assets.id,
                          originalCreatedAt: assets.createdAt,
                          id: undefined,
                          createdAt: undefined,
                        },
                      }
                    : undefined,
                };
              }),
            }
          : undefined,
        listingFeature: listingFeatures
          ? {
              create: {
                ...listingFeatures,
                originalId: listingFeatures.id,
                originalCreatedAt: listingFeatures.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingNeighborhoodAmenity: listingNeighborhoodAmenities
          ? {
              create: {
                ...listingNeighborhoodAmenities,
                originalId: listingNeighborhoodAmenities.id,
                originalCreatedAt: listingNeighborhoodAmenities.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsApplicationDropOffAddress: listingsApplicationDropOffAddress
          ? {
              create: {
                ...listingsApplicationDropOffAddress,
                originalId: listingsApplicationDropOffAddress.id,
                originalCreatedAt: listingsApplicationDropOffAddress.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsApplicationMailingAddress: listingsApplicationMailingAddress
          ? {
              create: {
                ...listingsApplicationMailingAddress,
                originalId: listingsApplicationMailingAddress.id,
                originalCreatedAt: listingsApplicationMailingAddress.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsApplicationPickUpAddress: listingsApplicationPickUpAddress
          ? {
              create: {
                ...listingsApplicationPickUpAddress,
                originalId: listingsApplicationPickUpAddress.id,
                originalCreatedAt: listingsApplicationPickUpAddress.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsBuildingAddress: listingsBuildingAddress
          ? {
              create: {
                ...listingsBuildingAddress,
                originalId: listingsBuildingAddress.id,
                originalCreatedAt: listingsBuildingAddress.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsLeasingAgentAddress: listingsLeasingAgentAddress
          ? {
              create: {
                ...listingsLeasingAgentAddress,
                originalId: listingsLeasingAgentAddress.id,
                originalCreatedAt: listingsLeasingAgentAddress.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,

        listingsAccessibleMarketingFlyerFile:
          listingsAccessibleMarketingFlyerFile
            ? {
                create: {
                  ...listingsAccessibleMarketingFlyerFile,
                  originalId: listingsAccessibleMarketingFlyerFile.id,
                  originalCreatedAt:
                    listingsAccessibleMarketingFlyerFile.createdAt,
                  id: undefined,
                  createdAt: undefined,
                },
              }
            : undefined,
        listingsBuildingSelectionCriteriaFile:
          listingsBuildingSelectionCriteriaFile
            ? {
                create: {
                  ...listingsBuildingSelectionCriteriaFile,
                  originalId: listingsBuildingSelectionCriteriaFile.id,
                  originalCreatedAt:
                    listingsBuildingSelectionCriteriaFile.createdAt,
                  id: undefined,
                  createdAt: undefined,
                },
              }
            : undefined,
        listingsMarketingFlyerFile: listingsMarketingFlyerFile
          ? {
              create: {
                ...listingsMarketingFlyerFile,
                originalId: listingsMarketingFlyerFile.id,
                originalCreatedAt: listingsMarketingFlyerFile.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingsResult: listingsResult
          ? {
              create: {
                ...listingsResult,
                originalId: listingsResult.id,
                originalCreatedAt: listingsResult.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        listingMultiselectQuestion: listingMultiselectQuestions?.length
          ? {
              create: listingMultiselectQuestions.map((lmsq) => ({
                ordinal: lmsq.ordinal,
                multiselectQuestion: {
                  connect: {
                    id: lmsq.multiselectQuestionId,
                  },
                },
              })),
            }
          : undefined,
        listingUtility: listingUtilities
          ? {
              create: {
                ...listingUtilities,
                originalId: listingUtilities.id,
                originalCreatedAt: listingUtilities.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        property: property
          ? {
              connect: {
                id: property.id,
              },
            }
          : undefined,
        listingImage: listingImages?.length
          ? {
              create: listingImages.map((elem) => ({
                description: elem.description,
                ordinal: elem.ordinal,
                asset: {
                  create: elem?.assets
                    ? {
                        originalId: elem.assets.id,
                        originalCreatedAt: elem.assets.createdAt,
                        updatedAt: elem.assets.updatedAt,
                        fileId: elem.assets.fileId,
                        label: elem.assets.label,
                      }
                    : undefined,
                },
              })),
            }
          : undefined,

        reservedCommunityType: reservedCommunityTypes
          ? {
              connect: {
                id: reservedCommunityTypes.id,
              },
            }
          : undefined,
        requiredDocumentsList: requiredDocumentsList
          ? {
              create: {
                ...requiredDocumentsList,
                originalId: requiredDocumentsList.id,
                originalCreatedAt: requiredDocumentsList.createdAt,
                id: undefined,
                createdAt: undefined,
              },
            }
          : undefined,
        unitGroup: unitGroups?.length
          ? {
              create: unitGroups.map((ug) => {
                const { unitGroupAmiLevels, unitTypes, ...remainder } = ug;
                return {
                  ...remainder,
                  originalId: remainder.id,
                  originalCreatedAt: remainder.createdAt,
                  id: undefined,
                  createdAt: undefined,
                  unitType: unitTypes?.length
                    ? {
                        connect: unitTypes.map((ut) => ({ id: ut.id })),
                      }
                    : undefined,
                  unitGroupAmiLevel: unitGroupAmiLevels?.length
                    ? {
                        create: unitGroupAmiLevels.map((ugal) => {
                          const { amiChart, ...leftOver } = ugal;
                          return {
                            ...leftOver,
                            originalId: leftOver.id,
                            originalCreatedAt: leftOver.createdAt,
                            id: undefined,
                            createdAt: undefined,
                            amiChart: amiChart
                              ? {
                                  connect: {
                                    id: amiChart.id,
                                  },
                                }
                              : undefined,
                          };
                        }),
                      }
                    : undefined,
                };
              }),
            }
          : undefined,
        unit: units?.length
          ? {
              create: units.map((u) => {
                const {
                  amiChart,
                  unitAmiChartOverrides,
                  unitRentTypes,
                  unitTypes,
                  ...remainder
                } = u;
                return {
                  ...remainder,
                  originalId: remainder.id,
                  originalCreatedAt: remainder.createdAt,
                  id: undefined,
                  createdAt: undefined,
                  amiChart: amiChart
                    ? {
                        connect: {
                          id: amiChart.id,
                        },
                      }
                    : undefined,
                  unitAmiChartOverride: unitAmiChartOverrides
                    ? {
                        create: {
                          ...unitAmiChartOverrides,
                          originalId: unitAmiChartOverrides.id,
                          originalCreatedAt: unitAmiChartOverrides.createdAt,
                          id: undefined,
                          createdAt: undefined,
                        },
                      }
                    : undefined,
                  unitRentType: unitRentTypes
                    ? {
                        connect: {
                          id: unitRentTypes.id,
                        },
                      }
                    : undefined,
                  unitType: unitTypes
                    ? {
                        connect: {
                          id: unitTypes.id,
                        },
                      }
                    : undefined,
                };
              }),
            }
          : undefined,
      },
    });

    return {
      success: true,
    };
  }
}
