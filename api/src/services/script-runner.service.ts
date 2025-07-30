import { Injectable, BadRequestException } from '@nestjs/common';
import {
  ApplicationMethodsTypeEnum,
  LanguagesEnum,
  MultiselectQuestionsApplicationSectionEnum,
  Prisma,
  PrismaClient,
  ReviewOrderTypeEnum,
} from '@prisma/client';
import axios from 'axios';
import dayjs from 'dayjs';
import { Request as ExpressRequest } from 'express';
import https from 'https';
import { AmiChartService } from './ami-chart.service';
import { FeatureFlagService } from './feature-flag.service';
import { MultiselectQuestionService } from './multiselect-question.service';
import { PrismaService } from './prisma.service';
import { SuccessDTO } from '../dtos/shared/success.dto';
import { User } from '../dtos/users/user.dto';
import { mapTo } from '../utilities/mapTo';
import { DataTransferDTO } from '../dtos/script-runner/data-transfer.dto';
import { AmiChartImportDTO } from '../dtos/script-runner/ami-chart-import.dto';
import { AmiChartCreate } from '../dtos/ami-charts/ami-chart-create.dto';
import { AmiChartUpdate } from '../dtos/ami-charts/ami-chart-update.dto';
import MultiselectQuestion from '../dtos/multiselect-questions/multiselect-question.dto';
import { AmiChartUpdateImportDTO } from '../dtos/script-runner/ami-chart-update-import.dto';
import { Compare } from '../dtos/shared/base-filter.dto';
import { HouseholdMemberRelationship } from '../../src/enums/applications/household-member-relationship-enum';
import { calculateSkip, calculateTake } from '../utilities/pagination-helpers';
import { AssetTransferDTO } from '../dtos/script-runner/asset-transfer.dto';
import { AssetService } from './asset.service';
import { OrderByEnum } from '../enums/shared/order-by-enum';

/**
  this is the service for running scripts
  most functions in here will be unique, but each function should only be allowed to fire once
*/
@Injectable()
export class ScriptRunnerService {
  constructor(
    private amiChartService: AmiChartService,
    private featureFlagService: FeatureFlagService,
    private assetService: AssetService,
    private multiselectQuestionService: MultiselectQuestionService,
    private prisma: PrismaService,
  ) {}

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers data from foreign data into the database this api normally connects to
   */
  async transferJurisdictionData(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
    prisma?: PrismaClient,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `data transfer ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );

    // connect to foreign db based on incoming connection string
    const client =
      prisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: dataTransferDTO.connectionString,
          },
        },
      });
    await client.$connect();

    const doorwayJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { name: dataTransferDTO.jurisdiction },
    });

    if (!doorwayJurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in Doorway database`,
      );
    }

    // get jurisdiction
    const jurisdiction: { id: string }[] =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = ${dataTransferDTO.jurisdiction}`;

    if (!jurisdiction?.length) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in foreign database`,
      );
    }

    // get ami charts
    const amiQuery = `SELECT items, name, id FROM ami_chart WHERE jurisdiction_id = '${jurisdiction[0].id}'`;
    const amiCharts: { items: any; name: string }[] =
      await client.$queryRawUnsafe(amiQuery);

    // save ami charts
    if (amiCharts?.length) {
      console.log(`migrating ${amiCharts.length} ami charts`);
      await this.prisma.amiChart.createMany({
        data: amiCharts.map((data) => {
          return { ...data, jurisdictionId: doorwayJurisdiction.id };
        }),
      });
    }

    // get multiselect questions
    const multiselectQuery = `SELECT mq.id, mq.text, mq.sub_text, mq.description, mq.links, mq.options, mq.opt_out_text, mq.hide_from_listing, mq.application_section
    FROM multiselect_questions mq, "_JurisdictionsToMultiselectQuestions" jmq
    WHERE jmq."A" = '${jurisdiction[0].id}'
    AND jmq."B" = mq.id`;
    const multiselectQuestions: {
      id: string;
      text: string;
      sub_text: string;
      description: string;
      links: string;
      options: string;
      hide_from_listing: boolean;
      application_section: MultiselectQuestionsApplicationSectionEnum;
      opt_out_text: string;
    }[] = await client.$queryRawUnsafe(multiselectQuery);

    // save multiselect questions
    if (multiselectQuestions?.length) {
      console.log(
        `migrating ${multiselectQuestions.length} multiselect questions`,
      );
      multiselectQuestions.forEach(async (question) => {
        await this.prisma.multiselectQuestions.create({
          data: {
            id: question.id,
            text: question.text,
            subText: question.sub_text,
            description: question.description,
            hideFromListing: question.hide_from_listing,
            applicationSection: question.application_section,
            links: question.links,
            options: question.options,
            optOutText: question.opt_out_text,
            jurisdictions: {
              connect: {
                id: doorwayJurisdiction.id,
              },
            },
          },
        });
      });
    }

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete(
      `data transfer ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );
    return { success: true };
  }

  createAddress(dbAddress, jurisdictionName?: string) {
    return {
      createdAt: dbAddress[0]['created_at'],
      placeName: dbAddress[0]['place_name'],
      city: dbAddress[0]['city'],
      county: dbAddress[0]['county'] || jurisdictionName,
      state: dbAddress[0]['state'],
      street: dbAddress[0]['street'],
      street2: dbAddress[0]['street2'],
      zipCode: dbAddress[0]['zip_code'],
      latitude: dbAddress[0]['latitude'],
      longitude: dbAddress[0]['longitude'],
    };
  }

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers data from foreign data into the database this api normally connects to
   */
  async transferJurisdictionListingData(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
    prisma?: PrismaClient,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `data transfer listings ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );

    // connect to foreign db based on incoming connection string
    const client =
      prisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: dataTransferDTO.connectionString,
          },
        },
      });
    await client.$connect();

    const doorwayJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { name: dataTransferDTO.jurisdiction },
    });

    if (!doorwayJurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in Doorway database`,
      );
    }

    // get jurisdiction
    const jurisdiction: { id: string }[] =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = ${dataTransferDTO.jurisdiction}`;

    if (!jurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in foreign database`,
      );
    }

    const listingQuery = `SELECT * FROM listings WHERE jurisdiction_id = '${jurisdiction[0].id}'`;
    const listings: any[] = await client.$queryRawUnsafe(listingQuery);

    if (listings?.length) {
      const priorityTypes: { id: string; name: string }[] =
        await client.$queryRaw`SELECT * FROM unit_accessibility_priority_types`;
      const doorwayPriorityTypes =
        await this.prisma.unitAccessibilityPriorityTypes.findMany();
      const rentTypes: { id: string; name: string }[] =
        await client.$queryRaw`SELECT * FROM unit_types`;
      const doorwayRentTypes = await this.prisma.unitRentTypes.findMany();
      console.log(`migrating ${listings.length} listings`);
      for (const listing of listings) {
        console.log(`migrating ${listing['name']} listing`);

        let buildingAddress;
        if (listing['building_address_id']) {
          buildingAddress = await client.$queryRawUnsafe(
            `SELECT * FROM address WHERE id = '${listing['building_address_id']}'`,
          );
        }
        let leasingAgentAddress;
        if (listing['leasing_agent_address_id']) {
          leasingAgentAddress = await client.$queryRawUnsafe(
            `SELECT * FROM address WHERE id = '${listing['leasing_agent_address_id']}'`,
          );
        }
        let applicationPickUpAddress;
        if (listing['application_pick_up_address_id']) {
          applicationPickUpAddress = await client.$queryRawUnsafe(
            `SELECT * FROM address WHERE id = '${listing['application_pick_up_address_id']}'`,
          );
        }
        let applicationDropOffAddress;
        if (listing['application_drop_off_address_id']) {
          applicationDropOffAddress = await client.$queryRawUnsafe(
            `SELECT * FROM address WHERE id = '${listing['application_drop_off_address_id']}'`,
          );
        }
        let applicationMailingAddress;
        if (listing['application_mailing_address_id']) {
          applicationMailingAddress = await client.$queryRawUnsafe(
            `SELECT * FROM address WHERE id = '${listing['application_mailing_address_id']}'`,
          );
        }
        let reservedCommunityType;
        if (listing['reserved_community_type_id']) {
          reservedCommunityType = await client.$queryRawUnsafe(
            `SELECT * FROM reserved_community_types WHERE id = '${listing['reserved_community_type_id']}'`,
          );
          if (reservedCommunityType.length) {
            const reservedCommunityTypes =
              await this.prisma.reservedCommunityTypes.findMany();
            const name = reservedCommunityType[0]['name'];
            const foundReservedCommunityType = reservedCommunityTypes.find(
              (communityType) =>
                communityType.name === name ||
                (name === 'senior' && communityType.name === 'senior55'),
            );
            if (foundReservedCommunityType) {
              reservedCommunityType = foundReservedCommunityType;
            }
          }
        }
        const applicationMethods: {
          type: string;
          label: string;
          external_reference: string;
          accepts_postmarked_applications: boolean;
          phone_number: string;
        }[] = await client.$queryRawUnsafe(
          `SELECT * FROM application_methods WHERE listing_id = '${listing['id']}'`,
        );

        const createdListing = await this.prisma.listings.create({
          data: {
            id: listing['id'],
            listingsBuildingAddress: buildingAddress?.length
              ? {
                  create: this.createAddress(
                    buildingAddress,
                    dataTransferDTO.jurisdiction,
                  ),
                }
              : undefined,
            listingsLeasingAgentAddress: leasingAgentAddress?.length
              ? {
                  create: this.createAddress(leasingAgentAddress),
                }
              : undefined,
            listingsApplicationPickUpAddress: applicationPickUpAddress?.length
              ? { create: this.createAddress(applicationPickUpAddress) }
              : undefined,
            listingsApplicationDropOffAddress: applicationDropOffAddress?.length
              ? { create: this.createAddress(applicationDropOffAddress) }
              : undefined,
            listingsApplicationMailingAddress: applicationMailingAddress?.length
              ? { create: this.createAddress(applicationMailingAddress) }
              : undefined,
            jurisdictions: {
              connect: {
                id: doorwayJurisdiction.id,
              },
            },
            reservedCommunityTypes: reservedCommunityType?.id
              ? {
                  connect: {
                    id: reservedCommunityType.id,
                  },
                }
              : undefined,
            applicationMethods: applicationMethods?.length
              ? {
                  createMany: {
                    data: applicationMethods.map((method) => {
                      return {
                        type: method.type as ApplicationMethodsTypeEnum,
                        label: method.label,
                        acceptsPostmarkedApplications:
                          method.accepts_postmarked_applications,
                        phoneNumber: method.phone_number,
                      };
                    }),
                  },
                }
              : undefined,
            createdAt: listing['created_at'],
            additionalApplicationSubmissionNotes:
              listing['additional_application_submission_notes'],
            digitalApplication: listing['digital_application'],
            commonDigitalApplication: listing['common_digital_application'],
            paperApplication: listing['paper_application'],
            referralOpportunity: listing['referral_opportunity'],
            assets: listing['assets'],
            accessibility: listing['accessibility'],
            amenities: listing['amenities'],
            buildingTotalUnits: listing['building_total_units'],
            developer: listing['developer'],
            householdSizeMax: listing['household_size_max'],
            householdSizeMin: listing['household_size_min'],
            neighborhood: listing['neighborhood'],
            petPolicy: listing['pet_policy'],
            smokingPolicy: listing['smoking_policy'],
            unitsAvailable: listing['units_available'],
            unitAmenities: listing['unit_amenities'],
            servicesOffered: listing['services_offered'],
            yearBuilt: listing['year_built'],
            applicationDueDate: listing['application_due_date'],
            applicationOpenDate: listing['application_open_date'],
            applicationFee: listing['application_fee'],
            applicationOrganization: listing['application_organization'],
            applicationPickUpAddressOfficeHours:
              listing['application_pick_up_address_office_hours'],
            applicationDropOffAddressOfficeHours:
              listing['application_drop_off_address_office_hours'],
            buildingSelectionCriteria: listing['building_selection_criteria'],
            costsNotIncluded: listing['costs_not_included'],
            creditHistory: listing['credit_history'],
            criminalBackground: listing['criminal_background'],
            depositMin: listing['deposit_min'],
            depositMax: listing['deposit_max'],
            depositHelperText: listing['deposit_helper_text'],
            disableUnitsAccordion: listing['disable_units_accordion'],
            leasingAgentEmail: listing['leasing_agent_email'],
            leasingAgentName: listing['leasing_agent_name'],
            leasingAgentOfficeHours: listing['leasing_agent_office_hours'],
            leasingAgentPhone: listing['leasing_agent_phone'],
            leasingAgentTitle: listing['leasing_agent_title'],
            name: listing['name'],
            postmarkedApplicationsReceivedByDate:
              listing['postmarked_applications_received_by_date'],
            programRules: listing['program_rules'],
            rentalAssistance: listing['rental_assistance'],
            rentalHistory: listing['rental_history'],
            requiredDocuments: listing['required_documents'],
            specialNotes: listing['special_notes'],
            waitlistCurrentSize: listing['waitlist_current_size'],
            waitlistMaxSize: listing['waitlist_current_size'],
            whatToExpect: listing['what_to_expect'],
            status: listing['status'],
            reviewOrderType: listing['review_order_type'],
            displayWaitlistSize: listing['display_waitlist_size'],
            reservedCommunityDescription:
              listing['reserved_community_description'],
            reservedCommunityMinAge: listing['reserved_community_min_age'],
            resultLink: listing['result_link'],
            isWaitlistOpen: listing['is_waitlist_open'],
            waitlistOpenSpots: listing['waitlist_open_spots'],
            customMapPin: listing['custom_map_pin'],
            publishedAt: listing['published_at'],
            closedAt: listing['closed_at'],
            // afs last run needs to be now so the afs job isn't triggered by the applications ported over in the next script
            afsLastRunAt: new Date(),
            lastApplicationUpdateAt: listing['last_application_update_at'],
            requestedChanges: listing['requested_changes'],
            requestedChangesDate: listing['requested_changes_date'],
            // NOTE: add requested changes user ID not be carried over
            amiPercentageMax: listing['ami_percentage_max'],
            amiPercentageMin: listing['ami_percentage_min'],
            homeType: listing['home_type'],
            hrdId: listing['hrd_id'],
            isVerified: listing['is_verified'],
            managementCompany: listing['management_company'],
            managementWebsite: listing['management_website'],
            marketingType: listing['marketing_type'],
            ownerCompany: listing['owner_company'],
            phoneNumber: listing['phone_number'],
            applicationPickUpAddressType:
              listing['application_pick_up_address_type'],
            applicationDropOffAddressType:
              listing['application_drop_off_address_type'],
            applicationMailingAddressType:
              listing['application_mailing_address_type'],
            contentUpdatedAt: listing['content_updated_at'],
          },
        });

        await this.prisma.listingTransferMap.create({
          data: {
            listingId: createdListing.id,
            oldId: listing['id'],
          },
        });

        // upload units
        const units: any[] = await client.$queryRawUnsafe(
          `SELECT u.*, ut.name FROM units u, unit_types ut WHERE ut.id = u.unit_type_id AND u.listing_id = '${listing['id']}'`,
        );
        for (const unit of units) {
          let doorwayAmiChart;
          let unitType;
          let priorityType: { id: string; name: string };
          let rentType;
          // We need to get the amiChart from Doorway because it might not have been carried over from HBA
          // Example: the ami chart in HBA is tied to the wrong jurisdiction
          if (unit['ami_chart_id']) {
            doorwayAmiChart = await this.prisma.amiChart.findFirst({
              where: { id: unit['ami_chart_id'] },
            });
            if (!doorwayAmiChart) {
              // logging any missed ami chart so we can manually consolidate it later
              console.log(
                `Ami chart not found in Doorway: ${unit['ami_chart_id']} for listing ${listing['name']}`,
              );
            }
          }
          if (unit['name']) {
            unitType = await this.prisma.unitTypes.findFirst({
              select: {
                id: true,
              },
              where: {
                name: unit['name'],
              },
            });
          }
          if (unit['priority_type_id']) {
            const fullPriorityType = priorityTypes.find(
              (type) => type.id === unit['priority_type_id'],
            );
            priorityType = doorwayPriorityTypes.find(
              (type) => type.name === fullPriorityType.name,
            );
            if (!priorityType) {
              // Log any priority types that aren't in Doorway so we can manually add later
              console.log(
                `Priority type not found in Doorway: "${fullPriorityType?.name}" for listing ${listing['name']}`,
              );
            }
          }
          if (unit['unit_rent_type_id']) {
            const fullRentType = rentTypes.find(
              (type) => type.id === unit['unit_rent_type_id'],
            );
            rentType = doorwayRentTypes.find(
              (type) => type.name === fullRentType.name,
            );
          }

          await this.prisma.units.create({
            data: {
              listings: {
                connect: {
                  id: createdListing.id,
                },
              },
              amiChart: doorwayAmiChart
                ? {
                    connect: {
                      id: doorwayAmiChart.id,
                    },
                  }
                : undefined,
              unitTypes: unitType
                ? {
                    connect: {
                      id: unitType.id,
                    },
                  }
                : undefined,
              unitAccessibilityPriorityTypes: priorityType
                ? { connect: { id: priorityType.id } }
                : undefined,
              unitRentTypes: rentType
                ? { connect: { id: rentType.id } }
                : undefined,
              amiPercentage: unit['ami_percentage'],
              annualIncomeMin: unit['annual_income_min'],
              annualIncomeMax: unit['annual_income_max'],
              floor: unit['floor'],
              monthlyIncomeMin: unit['monthly_income_min'],
              maxOccupancy: unit['max_occupancy'],
              minOccupancy: unit['min_occupancy'],
              monthlyRent: unit['monthly_rent'],
              numBathrooms: unit['num_bathrooms'],
              numBedrooms: unit['num_bedrooms'],
              number: unit['number'],
              sqFeet: unit['sq_feet'],
              monthlyRentAsPercentOfIncome:
                unit['monthly_rent_as_percent_of_income'],
              bmrProgramChart: unit['bmr_program_chart'],
              status: unit['status'],
            },
          });
        }

        // Migrate the listing to multiselect question mapping
        const listingMultiselectQuestions: {
          ordinal: number;
          listing_id: string;
          multiselect_question_id: string;
        }[] = await client.$queryRawUnsafe(
          `SELECT * FROM listing_multiselect_questions WHERE listing_id = '${listing['id']}'`,
        );
        if (listingMultiselectQuestions?.length) {
          console.log(
            `migrating ${listingMultiselectQuestions.length} listing multiselect questions`,
          );
          for (let i = 0; i < listingMultiselectQuestions.length; i++) {
            const lmq = listingMultiselectQuestions[i];

            try {
              await this.prisma.listingMultiselectQuestions.create({
                data: {
                  ordinal: lmq.ordinal,
                  listingId: createdListing.id,
                  multiselectQuestionId: lmq.multiselect_question_id,
                },
              });
            } catch (e) {
              // Log the failed ones so we can manually add them later if need be
              console.log(
                `unable to migrate listing multiselect question ${lmq.multiselect_question_id} to listing ${createdListing.id}`,
              );
            }
          }
        }

        // Migrate all events that don't have a file associated to it
        const listingEvents: any[] = await client.$queryRawUnsafe(
          `SELECT * FROM listing_events WHERE listing_id = '${listing['id']}' AND file_id IS NULL`,
        );
        if (listingEvents?.length) {
          console.log(`migrating ${listingEvents.length} listing events`);
          await this.prisma.listingEvents.createMany({
            data: listingEvents.map((event) => {
              return {
                type: event['type'],
                url: event['url'],
                listingId: createdListing.id,
                note: event['note'],
                label: event['label'],
                startTime: event['start_time'],
                endTime: event['end_time'],
                startDate: event['start_date'],
              };
            }),
          });
        }
      }
    }

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete(
      `data transfer listings ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers assets for listings in the specified space into the new space
   */
  async transferListingAssetData(
    req: ExpressRequest,
    dataTransferDTO: AssetTransferDTO,
    prisma?: PrismaClient,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `data transfer assets ${dataTransferDTO.jurisdiction} page: ${
        dataTransferDTO.page || 1
      }`,
      requestingUser,
    );

    // connect to foreign db based on incoming connection string
    const client =
      prisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: dataTransferDTO.connectionString,
          },
        },
      });
    await client.$connect();

    const doorwayJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { name: dataTransferDTO.jurisdiction },
    });

    if (!doorwayJurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in Doorway database`,
      );
    }

    // get jurisdiction
    const jurisdiction: { id: string }[] =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = ${dataTransferDTO.jurisdiction}`;

    if (!jurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in foreign database`,
      );
    }

    const take = calculateTake(40);
    const skip = calculateSkip(take, dataTransferDTO.page || 1);
    const listingTransferMap = await this.prisma.listingTransferMap.findMany({
      take,
      skip,
      orderBy: {
        listingId: OrderByEnum.ASC,
      },
    });
    console.log(
      `Found ${listingTransferMap.length} listings on page ${
        dataTransferDTO.page || 1
      } out of a possible 40 for this page`,
    );
    // loop over each new listing id <-> old listing id relation
    for (let i = 0; i < listingTransferMap.length; i++) {
      const oldAssetInfo: {
        ordinal: number;
        created_at: Date;
        updated_at: Date;
        file_id: string;
        label: string;
      }[] = await client.$queryRaw`SELECT
            li.ordinal,
            a.created_at,
            a.updated_at,
            a.file_id,
            label
        FROM listing_images li
            JOIN assets a ON a.id = li.image_id
        WHERE li.listing_id = ${listingTransferMap[i].oldId} :: UUID
          AND a.file_id IS NOT NULL AND a.file_id != ''`;
      console.log(
        `moving ${oldAssetInfo.length || 0} assets for listing: ${
          listingTransferMap[i].oldId
        }:`,
      );
      // loop over each listing image on the old listing
      for (let j = 0; j < oldAssetInfo.length; j++) {
        // pull down image from cloudinary
        const image = await axios.get(
          `https://res.cloudinary.com/${dataTransferDTO.cloudinaryName}/image/upload/${oldAssetInfo[j].file_id}.jpg`,
          {
            responseType: 'arraybuffer',
          },
        );
        const newFileId = (oldAssetInfo[j].file_id as string)
          .replace('housingbayarea/', '')
          .replace('dev/', '');

        // upload image to s3
        const res = await this.assetService.upload(newFileId, {
          filename: null,
          buffer: image.data,
          fieldname: null,
          originalname: `${newFileId}.jpg`,
          encoding: null,
          mimetype: 'image/jpeg',
          size: image.data.length,
          destination: null,
          path: null,
          stream: null,
        });

        // update new listing with these assets
        await this.prisma.listings.update({
          where: {
            id: listingTransferMap[i].listingId,
          },
          data: {
            listingImages: {
              create: {
                assets: {
                  create: {
                    fileId: res.url,
                    label: 'cloudinaryBuilding',
                  },
                },
                ordinal: oldAssetInfo[j].ordinal,
              },
            },
          },
        });
      }
    }

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete(
      `data transfer assets ${dataTransferDTO.jurisdiction} page: ${
        dataTransferDTO.page || 1
      }`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers partner users from foreign data into the database this api normally connects to
   */
  async transferJurisdictionPartnerUserData(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
    prisma?: PrismaClient,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `data transfer user and application ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );

    // connect to foreign db based on incoming connection string
    const client =
      prisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: dataTransferDTO.connectionString,
          },
        },
      });
    await client.$connect();

    const doorwayJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { name: dataTransferDTO.jurisdiction },
    });

    if (!doorwayJurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in Doorway database`,
      );
    }

    // get jurisdiction
    const jurisdiction: { id: string }[] =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = ${dataTransferDTO.jurisdiction}`;

    if (!jurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in foreign database`,
      );
    }

    const partnerUsers = await client.userAccounts.findMany({
      include: {
        listings: {
          select: { id: true, jurisdictionId: true },
        },
      },
      where: {
        userRoles: {
          isPartner: true,
        },
        jurisdictions: {
          some: { id: jurisdiction[0].id },
        },
      },
    });

    if (partnerUsers?.length) {
      console.log(`migrating ${partnerUsers.length} partner users`);
      for (const partner of partnerUsers) {
        const listings = partner.listings
          ? partner.listings
              .filter(
                (listing) => listing.jurisdictionId === jurisdiction[0].id,
              )
              .map((listing) => {
                return { id: listing.id };
              })
          : undefined;
        try {
          await this.prisma.userAccounts.create({
            data: {
              ...partner,
              updatedAt: undefined, // updated at should be the date it's imported to doorway
              agreedToTermsOfService: false, // Users will need to agree to terms again as they differ in Doorway
              listings: partner.listings
                ? {
                    connect: partner.listings
                      .filter(
                        (listing) =>
                          listing.jurisdictionId === jurisdiction[0].id,
                      )
                      .map((listing) => {
                        return { id: listing.id };
                      }),
                  }
                : undefined,
              userRoles: {
                create: { isPartner: true },
              },
              jurisdictions: {
                connect: {
                  id: doorwayJurisdiction.id,
                },
              },
            },
          });
        } catch (e) {
          console.log(
            `unable to migrate partner user ${
              partner.email
            } for listings ${listings
              ?.map((listing) => listing.id)
              .toLocaleString()}`,
          );
          console.log(e);
        }
      }
    }

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete(
      `data transfer user and application ${dataTransferDTO.jurisdiction}`,
      requestingUser,
    );

    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param dataTransferDTO data transfer endpoint args. Should contain foreign db connection string
   * @returns successDTO
   * @description transfers public users and corresponding applications from foreign data into the database this api normally connects to
   */
  async transferJurisdictionPublicUserAndApplicationData(
    req: ExpressRequest,
    dataTransferDTO: DataTransferDTO,
    prisma?: PrismaClient,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `data transfer public users and applications ${
        dataTransferDTO.jurisdiction
      } page ${dataTransferDTO.page || 1}`,
      requestingUser,
    );

    // connect to foreign db based on incoming connection string
    const client =
      prisma ||
      new PrismaClient({
        datasources: {
          db: {
            url: dataTransferDTO.connectionString,
          },
        },
      });
    await client.$connect();

    const doorwayJurisdiction = await this.prisma.jurisdictions.findFirst({
      where: { name: dataTransferDTO.jurisdiction },
    });

    if (!doorwayJurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in Doorway database`,
      );
    }

    // get jurisdiction
    const jurisdiction: { id: string }[] =
      await client.$queryRaw`SELECT id, name FROM jurisdictions WHERE name = ${dataTransferDTO.jurisdiction}`;

    if (!jurisdiction) {
      throw new Error(
        `${dataTransferDTO.jurisdiction} county doesn't exist in foreign database`,
      );
    }

    const skip = calculateSkip(5000, dataTransferDTO.page || 1);
    const take = calculateTake(5000);

    const publicUsers = await client.userAccounts.findMany({
      include: {
        applications: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            appUrl: true,
            householdSize: true,
            submissionType: true,
            acceptedTerms: true,
            submissionDate: true,
            markedAsDuplicate: true,
            confirmationCode: true,
            reviewStatus: true,
            status: true,
            language: true,
            listings: {
              select: {
                id: true,
                jurisdictionId: true,
              },
            },
            householdMember: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      where: {
        jurisdictions: {
          some: { id: jurisdiction[0].id },
        },
        userRoles: null,
      },
      skip,
      take,
      orderBy: {
        id: OrderByEnum.ASC,
      },
    });

    if (publicUsers?.length) {
      console.log(
        `migrating page ${dataTransferDTO.page || 1} of public users`,
      );
      let currentUserCount = 0;
      for (const publicUser of publicUsers) {
        let user = await this.prisma.userAccounts.findFirst({
          where: { email: publicUser.email },
        });
        if (!user) {
          user = await this.prisma.userAccounts.create({
            data: {
              ...publicUser,
              updatedAt: undefined, // updated at should be the date it's imported to doorway
              agreedToTermsOfService: false, // Users will need to agree to terms again as they differ in Doorway
              jurisdictions: {
                connect: {
                  id: doorwayJurisdiction.id,
                },
              },
              applications: undefined,
            },
          });
        } else {
          console.log(
            `a user with email ${user.email} already exists in the system`,
          );
        }
        for (const application of publicUser.applications) {
          // Only migrate applications for this jurisdiction
          if (application.listings.jurisdictionId === jurisdiction[0].id) {
            try {
              await this.prisma.applications.create({
                data: {
                  id: application.id,
                  createdAt: application.createdAt,
                  updatedAt: application.updatedAt,
                  deletedAt: application.deletedAt,
                  confirmationCode: application.confirmationCode,
                  submissionType: application.submissionType,
                  submissionDate: application.submissionDate,
                  preferences: [],
                  programs: [],
                  contactPreferences: [],
                  status: application.status,
                  householdSize: application.householdSize,
                  appUrl: application.appUrl,
                  markedAsDuplicate: application.markedAsDuplicate,
                  reviewStatus: application.reviewStatus,
                  userAccounts: {
                    connect: {
                      // Tie the application to the user, either the new user or the one in our system with the same email
                      id: user.id,
                    },
                  },
                  listings: {
                    connect: {
                      id: application.listings.id,
                    },
                  },
                },
              });
            } catch (e) {
              console.log('e', e);
              console.log(
                `unable to migrate application ${application.id} for user ${user.id}`,
              );
            }
          }
        }
        currentUserCount++;
        // console logs for progress of migration
        if (currentUserCount % 500 === 0) {
          console.log(`Progress: ${currentUserCount} users migrated`);
        }
      }
      console.log(`migrated page ${dataTransferDTO.page || 1} of public users`);
    }

    // disconnect from foreign db
    await client.$disconnect();

    // script runner standard spin down
    await this.markScriptAsComplete(
      `data transfer public users and applications ${
        dataTransferDTO.jurisdiction
      } page ${dataTransferDTO.page || 1}`,
      requestingUser,
    );

    return { success: true };
  }

  /**
   *
   * @param amiChartImportDTO this is a string in a very specific format like:
   * percentOfAmiValue_1 householdSize_1_income_value householdSize_2_income_value \n percentOfAmiValue_2 householdSize_1_income_value householdSize_2_income_value
   *
   * Copying and pasting from google sheets will not match the format above. You will need to perform the following:
   * 1) Find and delete all instances of "%"
   * 2) Using the Regex option in the Find and Replace tool, replace /\t with " " and /\n with "\\n"
   * @returns successDTO
   * @description takes the incoming AMI Chart string and stores it as a new AMI Chart in the database
   */
  async amiChartImport(
    req: ExpressRequest,
    amiChartImportDTO: AmiChartImportDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );

    // parse incoming string into an amichart create dto
    const createDTO: AmiChartCreate = {
      items: [],
      name: amiChartImportDTO.name,
      jurisdictions: {
        id: amiChartImportDTO.jurisdictionId,
      },
    };

    const rows = amiChartImportDTO.values.split('\n');
    rows.forEach((row: string) => {
      const values = row.split(' ');
      const percentage = values[0];
      values.forEach((value: string, index: number) => {
        if (index > 0) {
          createDTO.items.push({
            percentOfAmi: Number(percentage),
            householdSize: index,
            income: Number(value),
          });
        }
      });
    });

    await this.amiChartService.create(createDTO);

    // script runner standard spin down
    await this.markScriptAsComplete(
      `AMI Chart ${amiChartImportDTO.name}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param amiChartUpdateImportDTO this is a string in a very specific format like:
   * percentOfAmiValue_1 householdSize_1_income_value householdSize_2_income_value \n percentOfAmiValue_2 householdSize_1_income_value householdSize_2_income_value
   *
   * Copying and pasting from google sheets will not match the format above. You will need to perform the following:
   * 1) Find and delete all instances of "%"
   * 2) Using the Regex option in the Find and Replace tool, replace /\t with " " and /\n with "\\n"
   * See "How to format AMI data for script runner import" in Notion for a more detailed example
   * @returns successDTO
   * @description takes the incoming AMI Chart string and updates existing AMI Chart in the database
   */
  async amiChartUpdateImport(
    req: ExpressRequest,
    amiChartUpdateImportDTO: AmiChartUpdateImportDTO,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const scriptName = `AMI Chart ${
      amiChartUpdateImportDTO.amiId
    } update ${new Date()}`;
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(scriptName, requestingUser);

    const ami = await this.amiChartService.findOne(
      amiChartUpdateImportDTO.amiId,
    );

    // parse incoming string into an amichart create dto
    const updateDTO: AmiChartUpdate = {
      id: amiChartUpdateImportDTO.amiId,
      items: [],
      name: ami.name,
    };

    const rows = amiChartUpdateImportDTO.values.split('\n');
    rows.forEach((row: string) => {
      const values = row.split(' ');
      const percentage = values[0];
      values.forEach((value: string, index: number) => {
        if (index > 0) {
          updateDTO.items.push({
            percentOfAmi: Number(percentage),
            householdSize: index,
            income: Number(value),
          });
        }
      });
    });

    await this.amiChartService.update(updateDTO);

    // script runner standard spin down
    await this.markScriptAsComplete(scriptName, requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param jurisdiction should contain jurisdiction id
   * @returns successDTO
   * @description adds lottery translations to the database
   */
  async addLotteryTranslations(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('add lottery translations', requestingUser);
    this.addLotteryTranslationsHelper(true);
    await this.markScriptAsComplete('add lottery translations', requestingUser);

    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param jurisdiction should contain jurisdiction id
   * @returns successDTO
   * @description adds lottery translations to the database and create if does not exist
   */
  async addLotteryTranslationsCreateIfEmpty(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'add lottery translations create if empty',
      requestingUser,
    );
    this.addLotteryTranslationsHelper(true);
    await this.markScriptAsComplete(
      'add lottery translations create if empty',
      requestingUser,
    );

    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description opts out existing lottery listings
   */
  async optOutExistingLotteries(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'opt out existing lotteries',
      requestingUser,
    );

    const { count } = await this.prisma.listings.updateMany({
      data: {
        lotteryOptIn: false,
      },
      where: {
        reviewOrderType: ReviewOrderTypeEnum.lottery,
        lotteryOptIn: null,
      },
    });

    console.log(`updated lottery opt in for ${count} listings`);

    await this.markScriptAsComplete(
      'opt out existing lotteries',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description add duplicates information to lottery email
   */
  async addDuplicatesInformationToLotteryEmail(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'add duplicates information to lottery email',
      requestingUser,
    );

    await this.updateTranslationsForLanguage(LanguagesEnum.en, {
      lotteryAvailable: {
        duplicatesDetails:
          'Doorway generally does not accept duplicate applications. A duplicate application is one that has someone who also appears on another application for the same housing opportunity. For more detailed information on how we handle duplicates, see our',
        termsOfUse: 'Terms of Use',
      },
      confirmation: {
        submitAnotherApplication:
          'If you’re not changing the primary applicant or any household members, you can just submit another application.  We’ll take the last one submitted, per the duplicate application policy.',
        otherChanges:
          'For other changes, please contact doorway@bayareametro.gov.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.es, {
      lotteryAvailable: {
        duplicatesDetails:
          'Doorway generalmente no acepta solicitudes duplicadas. Una solicitud duplicada es aquella en la que aparece una persona que también aparece en otra solicitud para la misma oportunidad de vivienda. Para obtener información más detallada sobre cómo manejamos las solicitudes duplicadas, consulte nuestros',
        termsOfUse: 'Términos de uso',
      },
      confirmation: {
        submitAnotherApplication:
          'Si no va a cambiar al solicitante principal ni a ningún miembro del hogar, puede simplemente enviar otra solicitud.  Tomaremos el último enviado, según la política de solicitud de duplicados.',
        otherChanges:
          'Para otros cambios, comuníquese con doorway@bayareametro.gov',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.tl, {
      lotteryAvailable: {
        duplicatesDetails:
          'Ang Doorway sa pangkalahatan ay hindi tumatanggap ng mga duplicate na aplikasyon. Ang isang duplicate na aplikasyon ay isa na mayroong isang tao na lumilitaw din sa isa pang aplikasyon para sa parehong pagkakataon sa pabahay. Para sa mas detalyadong impormasyon sa kung paano namin pinangangasiwaan ang mga duplicate, tingnan ang aming',
        termsOfUse: 'Mga Tuntunin ng Paggamit',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.vi, {
      lotteryAvailable: {
        duplicatesDetails:
          'Doorway thường không chấp nhận các đơn xin trùng lặp. Một đơn xin trùng lặp là đơn xin có người cũng xuất hiện trên một đơn xin khác cho cùng một cơ hội nhà ở. Để biết thông tin chi tiết hơn về cách chúng tôi xử lý các đơn xin trùng lặp, hãy xem của chúng tôi',
        termsOfUse: 'Điều khoản sử dụng',
      },
      confirmation: {
        submitAnotherApplication:
          'Nếu bạn không thay đổi người nộp đơn chính hoặc bất kỳ thành viên nào trong gia đình, bạn chỉ cần gửi đơn đăng ký khác.  Chúng tôi sẽ lấy bản cuối cùng được gửi theo chính sách đăng ký trùng lặp.',
        otherChanges:
          'Đối với những thay đổi khác, vui lòng liên hệ với Door@bayareametro.gov.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.zh, {
      lotteryAvailable: {
        duplicatesDetails:
          'Doorway 一般不接受重复申请。重复申请是指申请者与另一份申请者有相同的住房机会。有关我们如何处理重复申请的更多详细信息，请参阅我们的',
        termsOfUse: '使用条款',
      },
      confirmation: {
        submitAnotherApplication:
          '如果你不改變主申請人或任何家庭成員，你可以提交另一份申請。  我們將根據重複申請政策採用最後提交的一份申請。',
        otherChanges: '如需其他變更，請聯絡doorway@bayareametro.gov。',
      },
    });

    await this.markScriptAsComplete(
      'add duplicates information to lottery email',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @param jurisdictionIdDTO id containing the jurisdiction id we are creating the new community type for
   * @param name name of the community type
   * @param name description of the community type
   * @returns successDTO
   * @description creates a new reserved community type. Reserved community types also need translations added
   */
  async createNewReservedCommunityType(
    req: ExpressRequest,
    jurisdictionId: string,
    name: string,
    description?: string,
  ): Promise<SuccessDTO> {
    // script runner standard start up
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      `${name} Type - ${jurisdictionId}`,
      requestingUser,
    );

    // create new reserved community type using the passed in params
    await this.prisma.reservedCommunityTypes.create({
      data: {
        name: name,
        description: description,
        jurisdictions: {
          connect: {
            id: jurisdictionId,
          },
        },
      },
    });

    // script runner standard spin down
    await this.markScriptAsComplete(
      `${name} Type - ${jurisdictionId}`,
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description updates single use code translations to show extended expiration time
   */
  async updateCodeExpirationTranslations(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'update code expiration translations',
      requestingUser,
    );

    const translations = await this.prisma.translations.findFirst({
      where: { language: 'en', jurisdictionId: null },
    });
    const translationsJSON =
      translations.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translations.id },
      data: {
        translations: {
          ...translationsJSON,
          singleUseCodeEmail: {
            greeting: 'Hi',
            message:
              'Use the following code to sign in to your Doorway account. This code will be valid for 10 minutes. Never share this code.',
            singleUseCode: '%{singleUseCode}',
          },
        },
      },
    });

    await this.markScriptAsComplete(
      'update code expiration translations',
      requestingUser,
    );
    return { success: true };
  }

  /**
    Marks all program multiselect questions as hidden from listings so they don't show on the public site details page
  */
  async hideProgramsFromListings(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('hideProgramsFromListings', requestingUser);
    await this.prisma.multiselectQuestions.updateMany({
      data: {
        hideFromListing: true,
      },
      where: {
        applicationSection: MultiselectQuestionsApplicationSectionEnum.programs,
      },
    });
    await this.markScriptAsComplete('hideProgramsFromListings', requestingUser);
    return { success: true };
  }

  async removeWorkAddresses(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('remove work addresses', requestingUser);

    let applicantLoop = true;

    while (applicantLoop) {
      const rawApplicants = await this.prisma.applicant.findMany({
        select: {
          id: true,
          workAddressId: true,
        },
        where: {
          workAddressId: {
            not: null,
          },
        },
        take: 10000,
      });

      if (!rawApplicants?.length) {
        applicantLoop = false;
      } else {
        console.log(
          `${rawApplicants.length} applicant work addresses to remove`,
        );

        await this.prisma.applicant.updateMany({
          data: {
            workAddressId: null,
          },
          where: {
            id: {
              in: rawApplicants.map((applicant) => applicant.id),
            },
          },
        });

        await this.prisma.address.deleteMany({
          where: {
            id: {
              in: rawApplicants.map((applicant) => applicant.workAddressId),
            },
          },
        });
      }
    }
    console.log(`All applicant work addresses have been removed`);

    let householdLoop = true;

    while (householdLoop) {
      const rawHouseholdMembers = await this.prisma.householdMember.findMany({
        select: {
          id: true,
          workAddressId: true,
        },
        where: {
          workAddressId: {
            not: null,
          },
        },
        take: 10000,
      });

      if (!rawHouseholdMembers?.length) {
        householdLoop = false;
      } else {
        console.log(
          `${rawHouseholdMembers.length} household member work addresses to remove`,
        );

        await this.prisma.householdMember.updateMany({
          data: {
            workAddressId: null,
          },
          where: {
            id: {
              in: rawHouseholdMembers.map((member) => member.id),
            },
          },
        });

        await this.prisma.address.deleteMany({
          where: {
            id: {
              in: rawHouseholdMembers.map((member) => member.workAddressId),
            },
          },
        });
      }
    }
    console.log(`All household member work addresses have been removed`);

    await this.markScriptAsComplete('remove work addresses', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description updates single use code translations to show extended expiration time
   */
  async addNoticeToListingOpportunityEmail(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'add notice translation for listing opportunity email',
      requestingUser,
    );

    await this.updateTranslationsForLanguage(LanguagesEnum.en, {
      rentalOpportunity: {
        viewListingNotice:
          'Please view listing for the most updated information',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.es, {
      rentalOpportunity: {
        viewListingNotice:
          'Consulte el listado para obtener la información más actualizada',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.tl, {
      rentalOpportunity: {
        viewListingNotice:
          'Mangyaring tingnan ang listahan para sa pinakabagong impormasyon',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.vi, {
      rentalOpportunity: {
        viewListingNotice: 'Vui lòng xem danh sách để biết thông tin mới nhất',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.zh, {
      rentalOpportunity: {
        viewListingNotice: '请查看列表以获取最新信息',
      },
    });

    await this.markScriptAsComplete(
      'add notice translation for listing opportunity email',
      requestingUser,
    );
    return { success: true };
  }

  /**
   * @param req incoming request object
   * @returns successDTO
   * @description updates the "what happens next" content in lottery email
   */
  async updatesWhatHappensInLotteryEmail(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'update what happens next content in lottery email',
      requestingUser,
    );

    await this.updateTranslationsForLanguage(LanguagesEnum.en, {
      lotteryAvailable: {
        whatHappensContent:
          'The property manager will begin to contact applicants in the order of lottery rank, within each lottery preference. When the units are all filled, the property manager will stop contacting applicants. All the units could be filled before the property manager reaches your rank. If this happens, you will not be contacted.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.es, {
      lotteryAvailable: {
        whatHappensContent:
          'El administrador de la propiedad comenzará a comunicarse con los solicitantes en el orden de clasificación de la lotería, dentro de cada preferencia de la lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Es posible que todas las unidades estén ocupadas antes de que el administrador de la propiedad alcance su clasificación. Si esto sucede, no se comunicarán con usted.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.tl, {
      lotteryAvailable: {
        whatHappensContent:
          'Ang tagapamahala ng ari-arian ay magsisimulang makipag-ugnayan sa mga aplikante sa pagkakasunud-sunod ng ranggo ng lottery, sa loob ng bawat kagustuhan sa lottery. Kapag napuno na ang lahat ng unit, hihinto na ang property manager sa pakikipag-ugnayan sa mga aplikante. Maaaring mapunan ang lahat ng unit bago maabot ng property manager ang iyong ranggo. Kung mangyari ito, hindi ka makontak.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.vi, {
      lotteryAvailable: {
        whatHappensContent:
          'Người quản lý bất động sản sẽ bắt đầu liên hệ với người nộp đơn theo thứ hạng xổ số, trong mỗi sở thích xổ số. Khi tất cả các đơn vị đã được lấp đầy, người quản lý bất động sản sẽ ngừng liên hệ với người nộp đơn. Tất cả các đơn vị có thể được lấp đầy trước khi người quản lý bất động sản đạt đến thứ hạng của bạn. Nếu điều này xảy ra, bạn sẽ không được liên hệ.',
      },
    });
    await this.updateTranslationsForLanguage(LanguagesEnum.zh, {
      lotteryAvailable: {
        whatHappensContent:
          '物业经理将按照抽签顺序开始联系申请人，每个抽签偏好内都是如此。当所有单元都已满时，物业经理将停止联系申请人。在物业经理达到您的排名之前，所有单元都可能已满。如果发生这种情况，您将不会被联系。',
      },
    });

    await this.markScriptAsComplete(
      'update what happens next content in lottery email',
      requestingUser,
    );
    return { success: true };
  }

  /**
    Adds all existing feature flags across Bloom to the database
  */
  async addFeatureFlags(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('add feature flags', requestingUser);

    const results = await Promise.all(
      this.featureFlags.map(async (flag) => {
        try {
          await this.featureFlagService.create(flag);
        } catch (e) {
          console.log(
            `feature flag ${flag.name} failed to be created. Error: ${e}`,
          );
        }
      }),
    );

    console.log(`Number of feature flags created: ${results.length}`);

    await this.markScriptAsComplete('add feature flags', requestingUser);
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description updates forgot email translations to match new Doorway copy
   */
  async updateForgotEmailTranslations(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'update forgot email translations',
      requestingUser,
    );

    const translationsEN = await this.prisma.translations.findFirst({
      where: { language: 'en', jurisdictionId: null },
    });
    const translationsENJSON =
      translationsEN.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translationsEN.id },
      data: {
        translations: {
          ...translationsENJSON,
          forgotPassword: {
            subject: 'Forgot your password?',
            callToAction:
              'If you did make this request, please click on the following link to choose a new password:',
            passwordInfo:
              "Note your password won't change until you click that link.",
            resetRequest:
              'We received a request to reset your Doorway Housing Portal password.',
            ignoreRequest:
              "If you didn't request this, please ignore this email.",
            changePassword: 'Change my password',
          },
        },
      },
    });

    const translationsES = await this.prisma.translations.findFirst({
      where: { language: 'es', jurisdictionId: null },
    });
    const translationsESJSON =
      translationsES.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translationsES.id },
      data: {
        translations: {
          ...translationsESJSON,
          forgotPassword: {
            subject: '¿Olvidaste tu contraseña?',
            callToAction:
              'Si realizó esta solicitud, haga clic en el siguiente enlace para elegir una nueva contraseña:',
            passwordInfo:
              'Tenga en cuenta que su contraseña no cambiará hasta que haga clic en ese enlace.',
            resetRequest:
              'Recibimos una solicitud para restablecer su contraseña de Doorway Housing Portal.',
            ignoreRequest:
              'Si no solicitó esto, ignore este correo electrónico.',
            changePassword: 'Cambiar mi contraseña',
          },
        },
      },
    });

    const translationsTL = await this.prisma.translations.findFirst({
      where: { language: 'tl', jurisdictionId: null },
    });
    const translationsTLJSON =
      translationsTL.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translationsTL.id },
      data: {
        translations: {
          ...translationsTLJSON,
          forgotPassword: {
            subject: 'Nakalimutan ang iyong password?',
            callToAction:
              'Kung ginawa mo ang kahilingan na ito, mangyaring mag -click sa sumusunod na link upang pumili ng isang bagong password:',
            passwordInfo:
              'Tandaan ang iyong password ay hindi magbabago hanggang sa i -click mo ang link na iyon.',
            resetRequest:
              'Nakatanggap kami ng isang kahilingan upang i -reset ang iyong Doorway Housing Portal password.',
            ignoreRequest:
              'Kung hindi mo ito hiniling, mangyaring huwag pansinin ang email na ito.',
            changePassword: 'Baguhin ang aking password',
          },
        },
      },
    });

    const translationsVI = await this.prisma.translations.findFirst({
      where: { language: 'vi', jurisdictionId: null },
    });
    const translationsVIJSON =
      translationsVI.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translationsVI.id },
      data: {
        translations: {
          ...translationsVIJSON,
          forgotPassword: {
            subject: 'Quên mật khẩu của bạn?',
            callToAction:
              'Nếu bạn đã thực hiện yêu cầu này, vui lòng nhấp vào liên kết sau để chọn mật khẩu mới:',
            passwordInfo:
              'Lưu ý mật khẩu của bạn sẽ không thay đổi cho đến khi bạn nhấp vào liên kết đó.',
            resetRequest:
              'Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu Doorway Housing Portal của bạn.',
            ignoreRequest:
              'Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.',
            changePassword: 'Thay đổi mật khẩu của tôi',
          },
        },
      },
    });

    const translationsZH = await this.prisma.translations.findFirst({
      where: { language: 'zh', jurisdictionId: null },
    });
    const translationsZHJSON =
      translationsZH.translations as unknown as Prisma.JsonArray;

    await this.prisma.translations.update({
      where: { id: translationsZH.id },
      data: {
        translations: {
          ...translationsZHJSON,
          forgotPassword: {
            subject: '忘記密碼了嗎?',
            callToAction:
              '如果您確實提出了此請求, 請單擊以下鏈接以選擇一個新密碼:',
            passwordInfo: '注意, 直到您單擊該鏈接, 您的密碼才會更改。',
            resetRequest:
              '我們收到了一個請求, 以重置您的Doorway Housing Portal密碼。',
            ignoreRequest: '如果您沒有要求此信息, 請忽略此電子郵件。',
            changePassword: '更改我的密碼',
          },
        },
      },
    });

    await this.markScriptAsComplete(
      'update forgot email translations',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description migrates the preferences and programs in Detroit to the multiselectQuestions table
   */
  async migrateDetroitToMultiselectQuestions(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'migrate Detroit to multiselect questions',
      requestingUser,
    );
    const translationURLs = [
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/ui-components/src/locales/general.json',
        key: 'generalCore',
      },
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/partners/page_content/locale_overrides/general.json',
        key: 'generalPartners',
      },
      {
        url: 'https://raw.githubusercontent.com/bloom-housing/bloom/dev/sites/public/page_content/locale_overrides/general.json',
        key: 'generalPublic',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/9f2084c107ec865e3c13393e600a5ac45ee5f424/detroit-ui-components/src/locales/general.json',
        key: 'detroitCore',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/partners/src/page_content/locale_overrides/general.json',
        key: 'detroitPartners',
      },
      {
        url: 'https://raw.githubusercontent.com/CityOfDetroit/bloom/dev/sites/public/src/page_content/locale_overrides/general.json',
        key: 'detroitPublic',
      },
    ];

    const translations = {};

    for (let i = 0; i < translationURLs.length; i++) {
      const { url, key } = translationURLs[i];
      translations[key] = await this.getTranslationFile(url);
    }

    // begin migration from preferences
    const preferences: {
      id;
      title;
      subtitle;
      description;
      links;
      form_metadata;
    }[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.links,
        p.form_metadata
      FROM preferences p
    `);

    for (let i = 0; i < preferences.length; i++) {
      const pref = preferences[i];
      const jurisInfo: { id; name }[] = await this.prisma.$queryRawUnsafe(`
          SELECT
            j.id,
            j.name
          FROM jurisdictions_preferences_preferences jp
            JOIN jurisdictions j ON jp.jurisdictions_id = j.id
          WHERE jp.preferences_id = '${pref.id}'
      `);
      const { optOutText, options } = this.resolveOptionValues(
        pref.form_metadata,
        'preferences',
        jurisInfo?.length ? jurisInfo[0].name : '',
        translations,
      );
      await this.multiselectQuestionService.create({
        text: pref.title,
        subText: pref.subtitle,
        description: pref.description,
        links: pref.links ?? null,
        hideFromListing: this.resolveHideFromListings(pref),
        optOutText: optOutText ?? null,
        options: options,
        applicationSection:
          MultiselectQuestionsApplicationSectionEnum.preferences,
        jurisdictions: jurisInfo.map((juris) => {
          return { id: juris.id };
        }),
      });
    }

    // begin migration from programs
    const programs: {
      id;
      title;
      subtitle;
      description;
      form_metadata;
    }[] = await this.prisma.$queryRawUnsafe(`
      SELECT 
        p.id,
        p.title,
        p.subtitle,
        p.description,
        p.form_metadata
      FROM programs p
    `);

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i];
      const jurisInfo: { id; name }[] = await this.prisma.$queryRawUnsafe(`
          SELECT
            j.id,
            j.name
          FROM jurisdictions_programs_programs jp
            JOIN jurisdictions j ON jp.jurisdictions_id = j.id
          WHERE jp.programs_id = '${prog.id}'
        `);

      const res: MultiselectQuestion =
        await this.multiselectQuestionService.create({
          text: prog.title,
          subText: prog.subtitle,
          description: prog.description,
          links: null,
          hideFromListing: this.resolveHideFromListings(prog),
          optOutText: null,
          options: null,
          applicationSection:
            MultiselectQuestionsApplicationSectionEnum.programs,
          jurisdictions: jurisInfo.map((juris) => {
            return { id: juris.id };
          }),
        });

      const listingsInfo: { ordinal; listing_id }[] = await this.prisma
        .$queryRawUnsafe(`
        SELECT
          ordinal,
          listing_id
        FROM listing_programs
        WHERE program_id = '${prog.id}';
      `);
      for (const listingInfo of listingsInfo) {
        await this.prisma.listings.update({
          data: {
            listingMultiselectQuestions: {
              create: {
                ordinal: listingInfo.ordinal,
                multiselectQuestionId: res.id,
              },
            },
          },
          where: {
            id: listingInfo.listing_id,
          },
        });
      }
    }

    await this.markScriptAsComplete(
      'migrate Detroit to multiselect questions',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description marks transferred data in Doorway as externally created
   */
  async markTransferedData(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('mark transfered data', requestingUser);

    // Alameda ==========================================================
    const alamedaMigrationDate = dayjs(
      '2025-05-05 00:00',
      'YYYY-MM-DD HH:mm Z',
    ).toDate();

    const alamedaJurisdiction =
      await this.prisma.jurisdictions.findFirstOrThrow({
        select: { id: true },
        where: { name: 'Alameda' },
      });

    const alamedaAppsCount = await this.prisma.applications.updateMany({
      data: { wasCreatedExternally: true },
      where: {
        appUrl: 'https://housing.acgov.org',
      },
    });

    console.log(`Alameda applications updated: ${alamedaAppsCount}`);

    const alamedaListingsCount = await this.prisma.listings.updateMany({
      data: { wasCreatedExternally: true },
      where: {
        createdAt: { lt: alamedaMigrationDate },
        jurisdictionId: alamedaJurisdiction.id,
      },
    });

    console.log(`Alameda listings updated: ${alamedaListingsCount}`);

    const alamedaMultiSelectQuestionIds = (
      await this.multiselectQuestionService.list({
        filter: [
          {
            $comparison: Compare['IN'],
            jurisdiction: alamedaJurisdiction.id,
          },
        ],
      })
    )
      .filter((question) => question.createdAt < alamedaMigrationDate)
      .map((question) => question.id);

    const alamedaMultiselectCount =
      await this.prisma.multiselectQuestions.updateMany({
        data: { wasCreatedExternally: true },
        where: {
          id: { in: alamedaMultiSelectQuestionIds },
        },
      });

    console.log(
      `Alameda multiselectQuestions updated: ${alamedaMultiselectCount}`,
    );

    console.log('Alameda data has been updated');

    // San Mateo ==========================================================
    const sanMateoBase = dayjs('2024-10-22 00:00', 'YYYY-MM-DD HH:mm Z');
    const sanMateo22 = sanMateoBase.toDate();
    const sanMateo25 = sanMateoBase.add(3, 'day').toDate();

    const sanMateoJurisdiction =
      await this.prisma.jurisdictions.findFirstOrThrow({
        select: { id: true },
        where: { name: 'San Mateo' },
      });

    const sanMateoAppsCount = await this.prisma.applications.updateMany({
      data: { wasCreatedExternally: true },
      where: {
        appUrl: 'https://smc.housingbayarea.org',
      },
    });

    console.log(`San Mateo applications updated: ${sanMateoAppsCount}`);

    const sanMateoListingsCount = await this.prisma.listings.updateMany({
      data: { wasCreatedExternally: true },
      where: {
        createdAt: { lt: sanMateo25 },
        jurisdictionId: sanMateoJurisdiction.id,
      },
    });

    console.log(`San Mateo listings updated: ${sanMateoListingsCount}`);

    const sanMateoMultiSelectQuestionIds = (
      await this.multiselectQuestionService.list({
        filter: [
          {
            $comparison: Compare['IN'],
            jurisdiction: sanMateoJurisdiction.id,
          },
        ],
      })
    )
      .filter((question) => question.createdAt < sanMateo22)
      .map((question) => question.id);

    const sanMateoMultiselectCount =
      await this.prisma.multiselectQuestions.updateMany({
        data: { wasCreatedExternally: true },
        where: {
          id: { in: sanMateoMultiSelectQuestionIds },
        },
      });

    console.log(
      `San Mateo multiselectQuestions updated: ${sanMateoMultiselectCount}`,
    );

    console.log('San Mateo data has been updated');

    await this.markScriptAsComplete('mark transfered data', requestingUser);
    return { success: true };
  }

  /**
    this is simply an example
  */
  async example(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('example', requestingUser);
    const rawJurisdictions = await this.prisma.jurisdictions.findMany();
    await this.markScriptAsComplete('example', requestingUser);
    return { success: !!rawJurisdictions.length };
  }

  // |------------------ HELPERS GO BELOW ------------------ | //

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is attempting to trigger the script run
   * @description this checks to see if the script has already ran, if not marks the script in the db
   */
  async markScriptAsRunStart(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    // check to see if script is already ran in db
    const storedScriptRun = await this.prisma.scriptRuns.findUnique({
      where: {
        scriptName,
      },
    });

    if (storedScriptRun?.didScriptRun) {
      // if script run has already successfully completed throw already succeed error
      throw new BadRequestException(
        `${scriptName} has already been run and succeeded`,
      );
    } else if (storedScriptRun?.didScriptRun === false) {
      // if script run was attempted but failed, throw attempt already failed error
      throw new BadRequestException(
        `${scriptName} has an attempted run and it failed, or is in progress. If it failed, please delete the db entry and try again`,
      );
    } else {
      // if no script run has been attempted create script run entry
      await this.prisma.scriptRuns.create({
        data: {
          scriptName,
          triggeringUser: userTriggeringTheRun.id,
        },
      });
    }
  }

  /**
   *
   * @param scriptName the name of the script that is going to be run
   * @param userTriggeringTheRun the user that is setting the script run as successfully completed
   * @description this marks the script run entry in the db as successfully completed
   */
  async markScriptAsComplete(
    scriptName: string,
    userTriggeringTheRun: User,
  ): Promise<void> {
    await this.prisma.scriptRuns.update({
      data: {
        didScriptRun: true,
        triggeringUser: userTriggeringTheRun.id,
      },
      where: {
        scriptName,
      },
    });
  }

  async updateTranslationsForLanguage(
    language: LanguagesEnum,
    newTranslations: Record<string, any>,
    createIfMissing?: boolean,
  ) {
    let translations;
    translations = await this.prisma.translations.findMany({
      where: { language },
    });

    if (!translations?.length) {
      if (createIfMissing) {
        const createdTranslations = await this.prisma.translations.create({
          data: {
            language: language,
            translations: {},
            jurisdictions: undefined,
          },
        });
        translations = [createdTranslations];
      } else {
        console.log(
          `Translations for ${language} don't exist in Doorway database`,
        );
        return;
      }
    }

    for (const translation of translations) {
      const translationsJSON = translation.translations as Prisma.JsonObject;

      Object.keys(newTranslations).forEach((key) => {
        translationsJSON[key] = {
          ...((translationsJSON[key] || {}) as Prisma.JsonObject),
          ...newTranslations[key],
        };
      });

      // technique taken from
      // https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/working-with-json-fields#advanced-example-update-a-nested-json-key-value
      const dataClause = Prisma.validator<Prisma.TranslationsUpdateInput>()({
        translations: translationsJSON,
      });

      await this.prisma.translations.update({
        where: { id: translation.id },
        data: dataClause,
      });
    }
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description update household member relationships
   */
  async updateHouseholdMemberRelationships(
    req: ExpressRequest,
  ): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'update household member relationships',
      requestingUser,
    );

    const updateRelationship = async (
      prev: string,
      updated: HouseholdMemberRelationship,
    ) => {
      const result = await this.prisma.householdMember.updateMany({
        data: {
          relationship: updated,
        },
        where: {
          relationship: prev,
        },
      });

      console.log(
        `updated relationship from ${prev} to ${updated} for ${
          result?.count ?? 0
        } household members`,
      );
    };

    updateRelationship('spouse', HouseholdMemberRelationship.spousePartner);
    updateRelationship(
      'registeredDomesticPartner',
      HouseholdMemberRelationship.spousePartner,
    );
    updateRelationship('sibling', HouseholdMemberRelationship.brotherSister);
    updateRelationship('aunt', HouseholdMemberRelationship.auntUncle);
    updateRelationship('uncle', HouseholdMemberRelationship.auntUncle);
    updateRelationship('nephew', HouseholdMemberRelationship.nephewNiece);
    updateRelationship('niece', HouseholdMemberRelationship.nephewNiece);
    updateRelationship(
      'grandparent',
      HouseholdMemberRelationship.grandparentGreatGrandparent,
    );
    updateRelationship(
      'greatGrandparent',
      HouseholdMemberRelationship.grandparentGreatGrandparent,
    );
    updateRelationship('inLaw', HouseholdMemberRelationship.other);

    await this.markScriptAsComplete(
      'update household member relationships',
      requestingUser,
    );
    return { success: true };
  }

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description remove empty race inputs
   */
  async removeEmptyRaceInputs(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart('remove empty race inputs', requestingUser);
    const allRaceDemographics = await this.prisma.demographics.findMany({
      select: { id: true, race: true },
      where: {
        race: { isEmpty: false },
      },
    });

    const emptyInputPattern = /:  +$/;
    const cleanedDemoData = allRaceDemographics.reduce((cleanedArr, demo) => {
      if (demo.race.some((raceInput) => emptyInputPattern.test(raceInput))) {
        const cleanedInput = demo.race.map((raceInput) =>
          raceInput.replace(emptyInputPattern, ''),
        );
        cleanedArr.push({ ...demo, race: cleanedInput });
      }
      return cleanedArr;
    }, []);

    cleanedDemoData.forEach(async (cleanedDemo) => {
      await this.prisma.demographics.update({
        where: {
          id: cleanedDemo.id,
        },
        data: {
          race: cleanedDemo.race,
        },
      });
    });
    await this.markScriptAsComplete('remove empty race inputs', requestingUser);
    return { success: true };
  }

  async addLotteryTranslationsHelper(createIfMissing?: boolean) {
    const enKeys = {
      lotteryReleased: {
        header: 'Lottery results for %{listingName} are ready to be published',
        adminApprovedStart:
          'Lottery results for %{listingName} have been released for publication. Please go to the listing view in your',
        adminApprovedEnd:
          'to view the lottery tab and release the lottery results.',
      },
      lotteryPublished: {
        header: 'Lottery results have been published for %{listingName}',
        resultsPublished:
          'Lottery results for %{listingName} have been published to applicant accounts.',
      },
      lotteryAvailable: {
        header: 'New Housing Lottery Results Available',
        resultsAvailable:
          'Results are available for a housing lottery for %{listingName}. See your Doorway Housing Portal account for more information.',
        signIn: 'Sign In to View Your Results',
        whatHappensHeader: 'What happens next?',
        whatHappensContent:
          'The property manager will begin to contact applicants by their preferred contact method. They will do so in the order of lottery rank, within each lottery preference. When the units are all filled, the property manager will stop contacting applicants. All the units could be filled before the property manager reaches your rank. If this happens, you will not be contacted.',
        otherOpportunities1:
          'To view other housing opportunities, please visit %{appUrl}. You can sign up to receive notifications of new application opportunities',
        otherOpportunities2: 'here',
        otherOpportunities3:
          'If you want to learn about how lotteries work, please see the lottery section of the',
        otherOpportunities4: 'Doorway Housing Portal Help Center',
      },
    };

    const esKeys = {
      lotteryAvailable: {
        header: 'Nuevos resultados de la lotería de vivienda disponibles',
        resultsAvailable:
          'Los resultados están disponibles para una lotería de vivienda para %{listingName}. Consulte su cuenta del portal de vivienda para obtener más información.',
        signIn: 'Inicie sesión para ver sus resultados',
        whatHappensHeader: '¿Qué pasa después?',
        whatHappensContent:
          'El administrador de la propiedad comenzará a comunicarse con los solicitantes mediante su método de contacto preferido. Lo harán en el orden de clasificación de la lotería, dentro de cada preferencia de lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Todas las unidades podrían llenarse antes de que el administrador de la propiedad alcance su rango. Si esto sucede, no lo contactaremos.',
        otherOpportunities1:
          'Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud',
        otherOpportunities2: 'aquí',
        otherOpportunities3:
          'Si desea obtener información sobre cómo funcionan las loterías, consulte la sección de lotería del',
        otherOpportunities4: 'Doorway Housing Portal Centro de ayuda',
      },
    };

    const tlKeys = {
      lotteryAvailable: {
        header: 'Bagong Housing Lottery Resulta Available',
        resultsAvailable:
          'Available ang mga resulta para sa isang housing lottery para sa %{listingName}. Tingnan ang iyong housing portal account para sa higit pang impormasyon.',
        signIn: 'Mag-sign In upang Tingnan ang Iyong Mga Resulta',
        whatHappensHeader: 'Anong mangyayari sa susunod?',
        whatHappensContent:
          'Magsisimulang makipag-ugnayan ang property manager sa mga aplikante sa pamamagitan ng kanilang gustong paraan ng pakikipag-ugnayan. Gagawin nila ito sa pagkakasunud-sunod ng ranggo ng lottery, sa loob ng bawat kagustuhan sa lottery. Kapag napuno na ang lahat ng unit, hihinto na ang property manager sa pakikipag-ugnayan sa mga aplikante. Maaaring mapunan ang lahat ng unit bago maabot ng property manager ang iyong ranggo. Kung mangyari ito, hindi ka makontak.',
        otherOpportunities1:
          'Upang tingnan ang iba pang pagkakataon sa pabahay, pakibisita ang %{appUrl}. Maaari kang mag-sign up upang makatanggap ng mga abiso ng mga bagong pagkakataon sa aplikasyon',
        otherOpportunities2: 'dito',
        otherOpportunities3:
          'Kung gusto mong malaman kung paano gumagana ang mga lottery, pakitingnan ang seksyon ng lottery ng',
        otherOpportunities4: 'Doorway Housing Portal Help Center',
      },
    };

    const viKeys = {
      lotteryAvailable: {
        header: 'Đã có kết quả xổ số nhà ở mới',
        resultsAvailable:
          'Đã có kết quả xổ số nhà ở cho %{listingName}. Xem tài khoản cổng thông tin nhà ở của bạn để biết thêm thông tin.',
        signIn: 'Đăng nhập để xem kết quả của bạn',
        whatHappensHeader: 'Chuyện gì xảy ra tiếp theo?',
        whatHappensContent:
          'Người quản lý tài sản sẽ bắt đầu liên hệ với người nộp đơn bằng phương thức liên hệ ưa thích của họ. Họ sẽ làm như vậy theo thứ tự xếp hạng xổ số, trong mỗi ưu tiên xổ số. Khi các căn hộ đã được lấp đầy, người quản lý tài sản sẽ ngừng liên hệ với người nộp đơn. Tất cả các đơn vị có thể được lấp đầy trước khi người quản lý tài sản đạt đến cấp bậc của bạn. Nếu điều này xảy ra, bạn sẽ không được liên lạc.',
        otherOpportunities1:
          'Để xem các cơ hội nhà ở khác, vui lòng truy cập %{appUrl}. Bạn có thể đăng ký để nhận thông báo về các cơ hội ứng tuyển mới',
        otherOpportunities2: 'đây',
        otherOpportunities3:
          'Nếu bạn muốn tìm hiểu về cách hoạt động của xổ số, vui lòng xem phần xổ số của',
        otherOpportunities4: 'Doorway Housing Portal Trung tâm trợ giúp',
      },
    };

    const zhKeys = {
      lotteryAvailable: {
        header: '新住房抽籤結果公佈',
        resultsAvailable:
          '%{listingName} 的住房抽籤結果可用。請參閱您的住房入口網站帳戶以獲取更多資訊。',
        signIn: '登入查看您的結果',
        whatHappensHeader: '接下來發生什麼事？',
        whatHappensContent:
          '物業經理將開始透過申請人首選的聯絡方式與申請人聯繫。他們將按照每個彩票偏好中的彩票排名順序進行操作。當單位全部住滿後，物業經理將停止聯絡申請人。在物業經理達到您的等級之前，所有單位都可以被填滿。如果發生這種情況，我們將不會與您聯繫。',
        otherOpportunities1:
          '要查看其他住房機會，請訪問 %{appUrl}。您可以註冊接收新申請機會的通知',
        otherOpportunities2: '這裡',
        otherOpportunities3: '如果您想了解彩票的運作方式，請參閱網站的彩票部分',
        otherOpportunities4: 'Doorway Housing Portal 幫助中心',
      },
    };
    await this.updateTranslationsForLanguage(
      LanguagesEnum.en,
      enKeys,
      createIfMissing,
    );
    await this.updateTranslationsForLanguage(
      LanguagesEnum.es,
      esKeys,
      createIfMissing,
    );
    await this.updateTranslationsForLanguage(
      LanguagesEnum.tl,
      tlKeys,
      createIfMissing,
    );
    await this.updateTranslationsForLanguage(
      LanguagesEnum.vi,
      viKeys,
      createIfMissing,
    );
    await this.updateTranslationsForLanguage(
      LanguagesEnum.zh,
      zhKeys,
      createIfMissing,
    );
  }

  featureFlags = [
    {
      name: 'enableSingleUseCode',
      description:
        'When true, the backend allows for logging into this jurisdiction using the single use code flow',
      active: false,
    },
    {
      name: 'enableAccessibiliyFeatures',
      description:
        "When true, the 'accessibility features' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'enableGeocodingPreferences',
      description:
        'When true, preferences can be created with geocoding functionality and when an application is created/updated on a listing that is geocoding then the application gets geocoded',
      active: false,
    },
    {
      name: 'enableGeocodingRadiusMethod',
      description:
        'When true, preferences can be created with geocoding functionality that verifies via a mile radius',
      active: false,
    },
    {
      name: 'enableListingOpportunity',
      description:
        "When true, any newly published listing will send a gov delivery email to everyone that has signed up for the 'listing alerts'",
      active: false,
    },
    {
      name: 'enablePartnerDemographics',
      description:
        'When true, demographics data is included in application or lottery exports for partners',
      active: false,
    },
    {
      name: 'enablePartnerSettings',
      description:
        "When true, the 'settings' tab in the partner site is visible",
      active: false,
    },
    {
      name: 'enableUtilitiesIncluded',
      description:
        "When true, the 'utilities included' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'enableNeighborhoodAmenities',
      description:
        "When true, the 'neighborhood amenities' section is displayed in listing creation/edit and the public listing view",
      active: false,
    },
    {
      name: 'exportApplicationAsSpreadsheet',
      description:
        'When true, the application export is done as an Excel spreadsheet',
      active: false,
    },
    {
      name: 'limitClosedListingActions',
      description:
        'When true, availability of edit, republish, and reopen functionality is limited for closed listings',
      active: false,
    },
    {
      name: 'showLottery',
      description:
        'When true, show lottery tab on lottery listings on the partners site',
      active: false,
    },
    {
      name: 'showMandatedAccounts',
      description:
        'When true, require users to be logged in to submit an application on the public site',
      active: false,
    },
    {
      name: 'showProfessionalPartners',
      description:
        'When true, show a navigation bar link to professional partners',
      active: false,
    },
    {
      name: 'showPublicLottery',
      description:
        'When true, show lottery section on the user applications page',
      active: false,
    },
    {
      name: 'showPwdless',
      description:
        "When true, show the 'get code to sign in' button on public sign in page for the pwdless flow",
      active: false,
    },
    {
      name: 'showSmsMfa',
      description:
        "When true, show the 'sms' button option when a user goes through multi factor authentication",
      active: false,
    },
  ];

  /**
   *
   * @param req incoming request object
   * @returns successDTO
   * @description resets all non-english translations
   */
  async resetMissingTranslations(req: ExpressRequest): Promise<SuccessDTO> {
    const requestingUser = mapTo(User, req['user']);
    await this.markScriptAsRunStart(
      'reset missing translations',
      requestingUser,
    );

    // delete all jurisdiction specific translations
    await this.prisma.translations.deleteMany({
      where: {
        jurisdictionId: {
          not: null,
        },
      },
    });

    await this.updateTranslationsForLanguage(
      'es',
      {
        confirmation: {
          subject: 'Confirmación de su solicitud',
          eligible: {
            fcfs: 'Los solicitantes elegibles serán contactados por orden de llegada hasta que se llenen las vacantes.',
            lottery:
              'Una vez que finalice el período de solicitud, los solicitantes elegibles serán ubicados según el orden del sorteo.',
            waitlist:
              'Los solicitantes elegibles serán colocados en la lista de espera por orden de llegada hasta que se llenen los espacios disponibles.',
            fcfsPreference:
              'Las preferencias de vivienda, si aplican, afectarán el orden de llegada.',
            waitlistContact:
              'Es posible que se le contacte mientras esté en la lista de espera para confirmar si desea permanecer en ella.',
            lotteryPreference:
              'Las preferencias de vivienda, si aplican, afectarán el orden del sorteo.',
            waitlistPreference:
              'Las preferencias de vivienda, si aplican, afectarán el orden de la lista de espera.',
          },
          interview:
            'Si se le contacta para una entrevista, se le pedirá que complete una solicitud más detallada y proporcione documentos de respaldo.',
          otherChanges:
            'Para otros cambios, por favor contacte doorway@bayareametro.gov.',
          whatToExpect: {
            FCFS: 'Los solicitantes serán contactados por el agente de la propiedad por orden de llegada hasta que se llenen las vacantes.',
            lottery:
              'Los solicitantes serán contactados por el agente según el orden del sorteo hasta que se llenen las vacantes.',
            noLottery:
              'Los solicitantes serán contactados por el agente según el orden de la lista de espera hasta que se llenen las vacantes.',
          },
          whileYouWait:
            'Mientras espera, hay cosas que puede hacer para prepararse para los posibles próximos pasos y futuras oportunidades.',
          shouldBeChosen:
            'Si su solicitud es elegida, prepárese para completar una solicitud más detallada y proporcionar los documentos de respaldo requeridos.',
          whatHappensNext: '¿Qué sucede después?',
          whatToExpectNext: 'Qué esperar después:',
          needToMakeUpdates: '¿Necesita hacer actualizaciones?',
          applicationsClosed: 'Solicitud <br />cerrada',
          applicationsRanked: 'Solicitud <br />clasificada',
          eligibleApplicants: {
            FCFS: 'Los solicitantes elegibles serán colocados en orden según el principio de <strong>primer llegado, primer servido</strong>.',
            lottery:
              'Los solicitantes elegibles serán colocados en orden <strong>según la preferencia y el rango de la lotería</strong>.',
            lotteryDate: 'El sorteo se llevará a cabo el %{lotteryDate}.',
          },
          applicationReceived: 'Solicitud <br />recibida',
          prepareForNextSteps: 'Prepárese para los siguientes pasos',
          thankYouForApplying:
            'Gracias por postular. Hemos recibido su solicitud para',
          readHowYouCanPrepare:
            'Lea sobre cómo puede prepararse para los siguientes pasos',
          yourConfirmationNumber: 'Su número de confirmación',
          applicationPeriodCloses:
            'Una vez que cierre el período de solicitud, el administrador de la propiedad comenzará a procesar las solicitudes.',
          contactedForAnInterview:
            'Si se le contacta para una entrevista, deberá completar una solicitud más detallada y proporcionar documentos de respaldo.',
          submitAnotherApplication:
            'Si no está cambiando al solicitante principal ni a ningún miembro del hogar, puede enviar otra solicitud. Tomaremos la última presentada, según la política de solicitudes duplicadas.',
          gotYourConfirmationNumber: 'Recibimos su solicitud para',
        },
        changeEmail: {
          message:
            'Se ha solicitado un cambio de dirección de correo electrónico para su cuenta',
          changeMyEmail: 'Confirmar cambio de correo electrónico',
          onChangeEmailMessage:
            'Para confirmar el cambio de su dirección de correo electrónico, haga clic en el enlace a continuación',
        },
        footer: {
          line1:
            'Doorway Housing Portal es un programa de Bay Area Housing Finance Authority (BAHFA)',
          footer:
            'Autoridad de Finanzas de Vivienda del Área de la Bahía (BAHFA)',
          thankYou: 'Gracias',
        },
        forgotPassword: {
          subject: '¿Olvidaste tu contraseña?',
          callToAction:
            'Si hiciste esta solicitud, por favor haz clic en el enlace a continuación para restablecer tu contraseña:',
          passwordInfo:
            'Tu contraseña no cambiará hasta que accedas al enlace anterior y crees una nueva.',
          resetRequest:
            'Se ha realizado una solicitud para restablecer tu contraseña del portal de Bloom Housing para %{appUrl}.',
          ignoreRequest:
            'Si no solicitaste esto, por favor ignora este correo electrónico.',
          changePassword: 'Cambiar mi contraseña',
        },
        leasingAgent: {
          officeHours: 'Horas de oficina:',
          propertyManager: 'Administrador de la propiedad',
          contactAgentToUpdateInfo:
            'Si necesita actualizar la información en su solicitud, no vuelva a postular. En su lugar, comuníquese con el agente de esta propiedad.',
        },
        lotteryAvailable: {
          header: 'Nuevos resultados de la lotería de viviendas disponibles',
          signIn: 'Inicie sesión para ver sus resultados',
          termsOfUse: 'Términos de uso',
          resultsAvailable:
            'Los resultados están disponibles para una lotería de viviendas para %{listingName}. Consulte su cuenta en el Portal de Vivienda Doorway para más información',
          duplicatesDetails:
            'Doorway generalmente no acepta solicitudes duplicadas. Una solicitud duplicada es aquella en la que alguien también aparece en otra solicitud para la misma oportunidad de vivienda. Para obtener más información sobre cómo manejamos las solicitudes duplicadas, consulte nuestra',
          whatHappensHeader: '¿Qué sucede después?',
          whatHappensContent:
            'El administrador de la propiedad comenzará a comunicarse con los solicitantes en el orden de clasificación de la lotería, dentro de cada preferencia de la lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Es posible que todas las unidades estén ocupadas antes de que el administrador de la propiedad alcance su clasificación. Si esto sucede, no se comunicarán con usted.',
          otherOpportunities1:
            'Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud, aquí',
          otherOpportunities2: 'aquí',
          otherOpportunities3:
            'Si desea aprender sobre cómo funcionan las loterías, consulte la sección de loterías del Centro de ayuda del Portal de Vivienda Doorway',
          otherOpportunities4: 'Doorway Housing Portal Centro de ayuda',
        },
        register: {
          welcome: 'Bienvenido',
          welcomeMessage:
            'Gracias por configurar tu cuenta en %{appUrl}. Ahora será más fácil para ti comenzar, guardar y enviar solicitudes en línea para las publicaciones que aparezcan en el sitio.',
          confirmMyAccount: 'Confirmar mi cuenta',
          toConfirmAccountMessage:
            'Para completar la creación de su cuenta, haga clic en el enlace a continuación:',
        },
        rentalOpportunity: {
          viewListingNotice:
            'Consulte el listado para obtener la información más actualizada',
        },
        singleUseCodeEmail: {
          message:
            'Usa el siguiente código para iniciar sesión en tu cuenta de Doorway. Este código será válido por 10 minutos. Nunca compartas este código.',
          greeting: 'Hola',
          singleUseCode: '%{singleUseCode}',
        },
        t: {
          hello: 'Hola',
          seeListing: 'Ver listado',
          editListing: 'Edit Listing',
          viewListing: 'View Listing',
          reviewListing: 'Review Listing',
          partnersPortal: 'Partners Portal',
        },
      },
      true,
    );

    await this.updateTranslationsForLanguage(
      'vi',
      {
        changeEmail: {
          message: 'Đã có yêu cầu thay đổi địa chỉ email cho tài khoản của bạn',
          changeMyEmail: 'Xác nhận thay đổi email',
          onChangeEmailMessage:
            'Để xác nhận thay đổi địa chỉ email của bạn, vui lòng nhấp vào liên kết bên dưới',
        },
        confirmation: {
          subject: 'Xác nhận đơn xin của bạn',
          eligible: {
            fcfs: 'Các ứng viên đủ điều kiện sẽ được liên hệ theo thứ tự nộp hồ sơ cho đến khi hết chỗ trống.',
            lottery:
              'Sau khi thời gian nộp hồ sơ kết thúc, các ứng viên đủ điều kiện sẽ được sắp xếp theo thứ tự xổ số.',
            waitlist:
              'Các ứng viên đủ điều kiện sẽ được sắp xếp vào danh sách chờ theo thứ tự nộp hồ sơ cho đến khi hết chỗ.',
            fcfsPreference:
              'Sở thích nhà ở, nếu áp dụng, sẽ ảnh hưởng đến thứ tự nộp hồ sơ.',
            waitlistContact:
              'Bạn có thể được liên hệ khi đang trong danh sách chờ để xác nhận rằng bạn muốn tiếp tục trong danh sách.',
            lotteryPreference:
              'Sở thích nhà ở, nếu áp dụng, sẽ ảnh hưởng đến thứ tự xổ số.',
            waitlistPreference:
              'Sở thích nhà ở, nếu áp dụng, sẽ ảnh hưởng đến thứ tự trong danh sách chờ.',
          },
          interview:
            'Nếu bạn được liên hệ để phỏng vấn, bạn sẽ được yêu cầu điền vào đơn chi tiết hơn và cung cấp các tài liệu hỗ trợ.',
          otherChanges:
            'Đối với các thay đổi khác, vui lòng liên hệ doorway@bayareametro.gov.',
          whatToExpect: {
            FCFS: 'Các ứng viên sẽ được liên hệ bởi đại lý tài sản theo thứ tự nộp hồ sơ cho đến khi hết chỗ trống.',
            lottery:
              'Các ứng viên sẽ được liên hệ bởi đại lý theo thứ tự xổ số cho đến khi hết chỗ trống.',
            noLottery:
              'Các ứng viên sẽ được liên hệ bởi đại lý theo thứ tự danh sách chờ cho đến khi hết chỗ trống.',
          },
          whileYouWait:
            'Trong khi chờ đợi, có những việc bạn có thể làm để chuẩn bị cho các bước tiếp theo và cơ hội trong tương lai.',
          shouldBeChosen:
            'Nếu đơn xin của bạn được chọn, hãy sẵn sàng điền vào đơn chi tiết hơn và cung cấp các tài liệu hỗ trợ cần thiết.',
          whatHappensNext: 'Chuyện gì xảy ra tiếp theo?',
          whatToExpectNext: 'Điều gì sẽ xảy ra tiếp theo:',
          needToMakeUpdates: 'Cần cập nhật không?',
          applicationsClosed: 'Đơn đăng ký <br />đã đóng',
          applicationsRanked: 'Đơn đăng ký <br />được xếp hạng',
          eligibleApplicants: {
            FCFS: 'Những người nộp đơn đủ điều kiện sẽ được sắp xếp theo <strong>nguyên tắc ai đến trước, phục vụ trước</strong>.',
            lottery:
              'Những người nộp đơn đủ điều kiện sẽ được sắp xếp theo <strong>ưu tiên và thứ hạng xổ số</strong>.',
            lotteryDate: 'Xổ số sẽ được tổ chức vào ngày %{lotteryDate}.',
          },
          applicationReceived: 'Đơn đăng ký <br />đã nhận',
          prepareForNextSteps: 'Chuẩn bị cho các bước tiếp theo',
          thankYouForApplying:
            'Cảm ơn bạn đã đăng ký. Chúng tôi đã nhận được đơn đăng ký của bạn cho',
          readHowYouCanPrepare:
            'Đọc về cách bạn có thể chuẩn bị cho các bước tiếp theo',
          yourConfirmationNumber: 'Mã xác nhận của bạn',
          applicationPeriodCloses:
            'Khi kết thúc thời gian đăng ký, người quản lý tài sản sẽ bắt đầu xử lý các đơn đăng ký.',
          contactedForAnInterview:
            'Nếu bạn được liên hệ để phỏng vấn, bạn sẽ cần điền vào đơn đăng ký chi tiết hơn và cung cấp các tài liệu hỗ trợ.',
          submitAnotherApplication:
            'Nếu bạn không thay đổi người nộp đơn chính hoặc bất kỳ thành viên nào trong gia đình, bạn có thể chỉ cần nộp một đơn đăng ký khác. Chúng tôi sẽ lấy đơn cuối cùng đã nộp, theo chính sách đơn đăng ký trùng lặp.',
          gotYourConfirmationNumber:
            'Chúng tôi đã nhận đơn đăng ký của bạn cho',
        },
        footer: {
          footer: 'Cơ quan Tài chính Nhà ở Khu Vực Vịnh (BAHFA)',
          line1:
            'Doorway Housing Portal là một chương trình của Bay Area Housing Finance Authority (BAHFA)',
          thankYou: 'Cảm ơn bạn',
        },
        forgotPassword: {
          subject: 'Quên mật khẩu của bạn?',
          callToAction:
            'Nếu bạn đã thực hiện yêu cầu này, vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:',
          passwordInfo:
            'Mật khẩu của bạn sẽ không thay đổi cho đến khi bạn truy cập vào liên kết trên và tạo một mật khẩu mới.',
          resetRequest:
            'Một yêu cầu để đặt lại mật khẩu của bạn trên trang web Cổng thông tin Nhà ở Bloom cho %{appUrl} vừa được thực hiện.',
          ignoreRequest:
            'Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.',
          changePassword: 'Thay đổi mật khẩu của tôi',
        },
        lotteryAvailable: {
          header: 'Kết quả xổ số nhà ở mới có sẵn',
          signIn: 'Đăng nhập để xem kết quả của bạn',
          termsOfUse: 'Điều khoản sử dụng',
          resultsAvailable:
            'Kết quả có sẵn cho xổ số nhà ở cho %{listingName}. Xem tài khoản Cổng thông tin Nhà ở Doorway của bạn để biết thêm thông tin',
          duplicatesDetails:
            'Doorway thường không chấp nhận các đơn đăng ký trùng lặp. Một đơn đăng ký trùng lặp là đơn đăng ký có người cũng xuất hiện trong đơn đăng ký khác cho cùng một cơ hội nhà ở. Để biết thông tin chi tiết về cách chúng tôi xử lý các đơn trùng lặp, vui lòng xem',
          whatHappensHeader: 'Chuyện gì sẽ xảy ra tiếp theo?',
          whatHappensContent:
            'Người quản lý bất động sản sẽ bắt đầu liên hệ với người nộp đơn theo thứ hạng xổ số, trong mỗi sở thích xổ số. Khi tất cả các đơn vị đã được lấp đầy, người quản lý bất động sản sẽ ngừng liên hệ với người nộp đơn. Tất cả các đơn vị có thể được lấp đầy trước khi người quản lý bất động sản đạt đến thứ hạng của bạn. Nếu điều này xảy ra, bạn sẽ không được liên hệ.',
          otherOpportunities1:
            'Để xem các cơ hội nhà ở khác, vui lòng truy cập %{appUrl}. Bạn có thể đăng ký nhận thông báo về các cơ hội đăng ký mới, tại đây',
          otherOpportunities2: 'đây',
          otherOpportunities3:
            'Nếu bạn muốn tìm hiểu cách thức xổ số hoạt động, vui lòng xem phần xổ số của Trung tâm trợ giúp Cổng thông tin Nhà ở Doorway',
        },
        leasingAgent: {
          officeHours: 'Giờ làm việc:',
          propertyManager: 'Quản lý tài sản',
          contactAgentToUpdateInfo:
            'Nếu bạn cần cập nhật thông tin trong đơn đăng ký của mình, đừng nộp đơn lại. Thay vào đó, hãy liên hệ với đại lý của danh sách này.',
        },
        register: {
          welcome: 'Welcome',
          welcomeMessage:
            'Cảm ơn bạn đã thiết lập tài khoản của mình trên %{appUrl}. Bây giờ bạn sẽ dễ dàng bắt đầu, lưu và gửi các đơn đăng ký trực tuyến cho các danh sách xuất hiện trên trang web.',
          confirmMyAccount: 'Xác nhận tài khoản của tôi',
          toConfirmAccountMessage:
            'Để hoàn tất việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:',
        },
        rentalOpportunity: {
          viewListingNotice:
            'Vui lòng xem danh sách để biết thông tin mới nhất',
        },
        singleUseCodeEmail: {
          message:
            'Sử dụng mã sau để đăng nhập vào tài khoản Doorway của bạn. Mã này sẽ có giá trị trong 10 phút. Không bao giờ chia sẻ mã này.',
          greeting: 'Chào',
          singleUseCode: '%{singleUseCode}',
        },
        t: {
          hello: 'Chào',
          seeListing: 'Xem danh sách',
        },
      },
      true,
    );

    await this.updateTranslationsForLanguage(
      'zh',
      {
        changeEmail: {
          message: '已請求更改您的帳戶電子郵件地址',
          changeMyEmail: '確認電子郵件更改',
          onChangeEmailMessage:
            '若要確認您的電子郵件地址更改，請點擊下面的鏈接',
        },
        confirmation: {
          subject: '您的申請確認',
          eligible: {
            fcfs: '符合資格的申請人將按先同先服基礎連絡直到完成為止。',
            lottery: '申請期間結束後，符合資格的申請人將按抽結後順序排序。',
            waitlist: '符合資格的申請人將按先同先服基礎排入候選名單直到完成。',
            fcfsPreference: '住宅優先者，如透透功能將影響先同先服。',
            waitlistContact:
              '在候選名單時可能會被聯絡，以確認您願意繼續位於候選名單。',
            lotteryPreference: '住宅優先者，如透透功能將影響抽結順序。',
            waitlistPreference: '住宅優先者，如透透功能將影響候選名單順序。',
          },
          interview:
            '如果被聯絡參加面試，您將被要求填寫更詳細的申請表並提供相關文件。',
          otherChanges: '如需其他更改，請聯絡 doorway@bayareametro.gov。',
          whatToExpect: {
            FCFS: '申請人將由物業代理按先同先服順序聯絡，直到填滿空缺為止。',
            lottery: '申請人將根據抽籤順序由代理聯絡直到填滿空缺為止。',
            noLottery: '申請人將根據候補名單順序由代理聯絡直到填滿空缺為止。',
          },
          whileYouWait: '等候期間，您可以準備一些潛在的下一步和未來的機會。',
          shouldBeChosen:
            '如果您的申請被選中，請準備填寫更詳細的申請表並提供所需的支持文件。',
          whatHappensNext: '接下來會發生什麼？',
          whatToExpectNext: '接下來的期望：',
          needToMakeUpdates: '需要進行更新嗎？',
          applicationsClosed: '申請 <br />已關閉',
          applicationsRanked: '申請 <br />已排序',
          eligibleApplicants: {
            FCFS: '符合資格的申請人將根據<strong>先到先得</strong>原則排序。',
            lottery:
              '符合資格的申請人將根據<strong>優先順序和抽籤排名</strong>排序。',
            lotteryDate: '抽籤將於 %{lotteryDate} 進行。',
          },
          applicationReceived: '申請 <br />已接收',
          prepareForNextSteps: '準備下一步',
          thankYouForApplying: '感謝您的申請。我們已收到您的申請',
          readHowYouCanPrepare: '閱讀如何準備下一步',
          yourConfirmationNumber: '您的確認號碼',
          applicationPeriodCloses: '當申請期間結束後，物業經理將開始處理申請。',
          contactedForAnInterview:
            '如果您被聯繫進行面試，您需要填寫更詳細的申請並提供支持文件。',
          submitAnotherApplication:
            '如果您沒有更改主要申請人或任何家庭成員，您可以只提交另一份申請。我們會根據重複申請政策接受最後提交的申請。',
          gotYourConfirmationNumber: '我們已收到您的申請',
        },
        footer: {
          footer: '海灣區住房金融管理局（BAHFA）',
          line1:
            'Doorway Housing Portal 是 Bay Area Housing Finance Authority（BAHFA）的一個項目',
          thankYou: '謝謝',
        },
        forgotPassword: {
          subject: '忘記密碼？',
          callToAction: '如果您進行了此請求，請點擊下面的鏈接重設您的密碼：',
          passwordInfo:
            '您的密碼不會更改，直到您訪問上述鏈接並創建一個新密碼。',
          resetRequest:
            '最近有人請求重設您在 %{appUrl} 上的 Bloom Housing Portal 網站密碼。',
          ignoreRequest: '如果您沒有請求這個，請忽略這封電子郵件。',
          changePassword: '更改我的密碼',
        },
        lotteryAvailable: {
          header: '新的住房抽籤結果可用',
          signIn: '登入以查看您的結果',
          termsOfUse: '使用條款',
          resultsAvailable:
            '關於%{listingName}的住房抽籤結果已可用。請查看您的Doorway住房入口網站帳戶以了解更多信息',
          duplicatesDetails:
            'Doorway 通常不接受重複申請。重複申請是指某人也出現在另一個申請中，該申請是針對相同的住房機會。要了解我們如何處理重複申請的詳細信息，請參閱',
          whatHappensHeader: '接下來會發生什麼？',
          whatHappensContent:
            '物业经理将按照抽签顺序开始联系申请人，每个抽签偏好内都是如此。当所有单元都已满时，物业经理将停止联系申请人。在物业经理达到您的排名之前，所有单元都可能已满。如果发生这种情况，您将不会被联系。',
          otherOpportunities1:
            '若要查看其他住房機會，請訪問 %{appUrl}。您可以在此處註冊以接收有關新申請機會的通知',
          otherOpportunities2: '這裡',
          otherOpportunities3:
            '如果您想了解抽籤如何運作，請查看Doorway住房入口網站幫助中心的抽籤部分',
          otherOpportunities4: 'Doorway Housing Portal 幫助中心',
        },
        leasingAgent: {
          officeHours: '辦公時間：',
          propertyManager: '物業經理',
          contactAgentToUpdateInfo:
            '如果您需要更新申請中的信息，請不要再次申請。請與此房源的代理聯繫。',
        },
        register: {
          welcome: '歡迎',
          welcomeMessage:
            '感謝您在 %{appUrl} 上設置帳戶。現在，您將更容易開始、保存和提交網站上顯示的房源的在線申請。',
          confirmMyAccount: '確認我的帳戶',
          toConfirmAccountMessage: '若要完成您的帳戶創建，請點擊下面的鏈接：',
        },
        rentalOpportunity: { viewListingNotice: '请查看列表以获取最新信息' },
        singleUseCodeEmail: {
          message:
            '使用以下代碼登入您的Doorway帳戶。此代碼將在10分鐘內有效。切勿分享此代碼。',
          greeting: '你好',
          singleUseCode: '%{singleUseCode}',
        },
        t: {
          hello: '你好',
          seeListing: '查看房源',
        },
      },
      true,
    );

    await this.updateTranslationsForLanguage(
      'tl',
      {
        changeEmail: {
          message:
            'Mayroong kahilingan para baguhin ang email address ng iyong account',
          changeMyEmail: 'Kumpirmahin ang pagbabago ng email',
          onChangeEmailMessage:
            'Upang kumpirmahin ang pagbabago ng iyong email address, mangyaring i-click ang link sa ibaba',
        },
        confirmation: {
          subject: 'Kumpirmasyon ng Iyong Aplikasyon',
          eligible: {
            fcfs: 'Ang mga kwalipikadong aplikante ay kokontakin ayon sa prinsipyo ng unang dumating, unang makakakuha hanggang mapunan ang mga bakanteng puwesto.',
            lottery:
              'Kapag natapos ang panahon ng aplikasyon, ang mga kwalipikadong aplikante ay isasaayos batay sa pagkakasunud-sunod ng loterya.',
            waitlist:
              'Ang mga kwalipikadong aplikante ay ilalagay sa listahan ng paghihintay ayon sa prinsipyo ng unang dumating, unang makakakuha hanggang mapuno ang listahan.',
            fcfsPreference:
              'Ang mga prayoridad sa pabahay, kung naaangkop, ay makakaapekto sa prinsipyo ng unang dumating, unang makakakuha.',
            waitlistContact:
              'Maaaring makontak ka habang nasa listahan ng paghihintay upang kumpirmahin na nais mong manatili rito.',
            lotteryPreference:
              'Ang mga prayoridad sa pabahay, kung naaangkop, ay makakaapekto sa pagkakasunud-sunod ng loterya.',
            waitlistPreference:
              'Ang mga prayoridad sa pabahay, kung naaangkop, ay makakaapekto sa pagkakasunud-sunod ng listahan ng paghihintay.',
          },
          interview:
            'Kung makontak ka para sa isang panayam, hihilingin kang magpasa ng mas detalyadong aplikasyon at magbigay ng mga sumusuportang dokumento.',
          otherChanges:
            'Para sa iba pang pagbabago, makipag-ugnayan sa doorway@bayareametro.gov.',
          whatToExpect: {
            FCFS: 'Ang mga aplikante ay kokontakin ng ahente ng ari-arian ayon sa prinsipyo ng unang dumating, unang makakakuha hanggang mapunan ang mga bakante.',
            lottery:
              'Ang mga aplikante ay kokontakin ng ahente batay sa pagkakasunud-sunod ng loterya hanggang mapunan ang mga bakante.',
            noLottery:
              'Ang mga aplikante ay kokontakin ng ahente batay sa pagkakasunud-sunod ng listahan ng paghihintay hanggang mapunan ang mga bakante.',
          },
          whileYouWait:
            'Habang naghihintay, may mga bagay na maaari mong gawin upang maghanda para sa mga susunod na hakbang at mga oportunidad sa hinaharap.',
          shouldBeChosen:
            'Kung ang iyong aplikasyon ay mapili, maging handang magpasa ng mas detalyadong aplikasyon at magbigay ng kinakailangang mga sumusuportang dokumento.',
          whatHappensNext: 'Ano ang susunod na mangyayari?',
          whatToExpectNext: 'Ano ang aasahan sa susunod:',
          needToMakeUpdates: 'Kailangan bang mag-update?',
          applicationsClosed: 'Aplikasyon <br />sarado',
          applicationsRanked: 'Aplikasyon <br />na-ranggo',
          eligibleApplicants: {
            FCFS: 'Ang mga kwalipikadong aplikante ay ilalagay batay sa <strong>unang dumating, unang pagsisilbi</strong>.',
            lottery:
              'Ang mga kwalipikadong aplikante ay ilalagay batay sa <strong>pagpili at ranggo sa loterya</strong>.',
            lotteryDate: 'Ang loterya ay gaganapin sa %{lotteryDate}.',
          },
          applicationReceived: 'Aplikasyon <br />natanggap',
          prepareForNextSteps: 'Maghanda para sa mga susunod na hakbang',
          thankYouForApplying:
            'Salamat sa pag-aapply. Natanggap namin ang iyong aplikasyon para sa',
          readHowYouCanPrepare:
            'Basahin kung paano ka makakapaghanda para sa mga susunod na hakbang',
          yourConfirmationNumber: 'Ang iyong Confirmation Number',
          applicationPeriodCloses:
            'Kapag natapos na ang panahon ng aplikasyon, sisimulan ng tagapamahala ng ari-arian ang pagproseso ng mga aplikasyon.',
          contactedForAnInterview:
            'Kung ikaw ay makontak para sa isang interbyu, kailangan mong mag-fill out ng mas detalyadong aplikasyon at magbigay ng mga dokumentong sumusuporta.',
          submitAnotherApplication:
            'Kung hindi mo binabago ang pangunahing aplikante o anumang miyembro ng sambahayan, maaari ka lamang magsumite ng isa pang aplikasyon. Aaminin namin ang huling isinumite, ayon sa patakaran ng duplicate na aplikasyon.',
          gotYourConfirmationNumber:
            'Nakuha namin ang iyong aplikasyon para sa',
        },
        footer: {
          line1:
            'Ang Doorway Housing Portal ay isang programa ng Bay Area Housing Finance Authority (BAHFA)',
          line2: '',
          footer: 'Bay Area Housing Finance Authority (BAHFA)',
          thankYou: 'Salamat',
        },
        forgotPassword: {
          subject: 'Nakalimutan mo ba ang iyong password?',
          callToAction:
            'Kung ikaw ang nag-request nito, mangyaring i-click ang link sa ibaba upang i-reset ang iyong password: ',
          passwordInfo:
            'Hindi magbabago ang iyong password hanggang hindi mo naa-access ang link sa itaas at gumawa ng bago.',
          resetRequest:
            'Mayroon nang isang kahilingan upang i-reset ang iyong Bloom Housing Portal website password para sa %{appUrl}.',
          ignoreRequest:
            'Kung hindi mo ito hiniling, mangyaring huwag pansinin ang email na ito.',
          changePassword: 'Baguhin ang aking password',
        },
        lotteryAvailable: {
          header: 'Mga Bagong Resulta ng Loteriya ng Pabahay na Magagamit',
          signIn: 'Mag-sign In upang Tingnan ang Iyong mga Resulta',
          termsOfUse: 'Mga Tuntunin ng Paggamit',
          resultsAvailable:
            'Magagamit ang mga resulta para sa isang loterya ng pabahay para sa %{listingName}. Tingnan ang iyong Doorway Housing Portal account para sa karagdagang impormasyon',
          duplicatesDetails:
            'Karaniwang hindi tinatanggap ng Doorway ang mga dobleng aplikasyon. Ang dobleng aplikasyon ay isang aplikasyon kung saan may isa ring tao na lumalabas sa ibang aplikasyon para sa parehong pagkakataon sa pabahay. Para sa mas detalyadong impormasyon kung paano namin pinangangasiwaan ang mga dobleng aplikasyon, mangyaring tingnan ang aming',
          whatHappensHeader: 'Ano ang mangyayari pagkatapos nito?',
          whatHappensContent:
            'Ang tagapamahala ng ari-arian ay magsisimulang makipag-ugnayan sa mga aplikante sa pagkakasunud-sunod ng ranggo ng lottery, sa loob ng bawat kagustuhan sa lottery. Kapag napuno na ang lahat ng unit, hihinto na ang property manager sa pakikipag-ugnayan sa mga aplikante. Maaaring mapunan ang lahat ng unit bago maabot ng property manager ang iyong ranggo. Kung mangyari ito, hindi ka makontak.',
          otherOpportunities1:
            'Upang makita ang iba pang mga pagkakataon sa pabahay, mangyaring bisitahin ang %{appUrl}. Maaari kang mag-sign up upang makatanggap ng mga abiso tungkol sa mga bagong pagkakataon sa aplikasyon, dito',
          otherOpportunities2: 'dito',
          otherOpportunities3:
            'Kung nais mong malaman kung paano gumagana ang mga loterya, mangyaring tingnan ang seksyon ng loterya sa Doorway Housing Portal Help Center',
          otherOpportunities4: 'Doorway Housing Portal Help Center',
        },
        leasingAgent: {
          officeHours: 'Oras ng opisina:',
          propertyManager: 'Tagapamahala ng Ari-arian',
          contactAgentToUpdateInfo:
            'Kung kailangan mong i-update ang impormasyon sa iyong aplikasyon, huwag mag-aplay muli. Sa halip, makipag-ugnayan sa ahente para sa listahang ito.',
        },
        register: {
          welcome: 'Maligayang pagdating',
          welcomeMessage:
            'Salamat sa pag-set up ng iyong account sa %{appUrl}. Mas madali na ngayon para sa iyo na magsimula, mag-save, at mag-submit ng mga online na aplikasyon para sa mga listahan na lumalabas sa site.',
          confirmMyAccount: 'Kumpirmahin ang aking account',
          toConfirmAccountMessage:
            'Upang kumpletuhin ang paglikha ng iyong account, mangyaring i-click ang link sa ibaba:',
        },
        rentalOpportunity: {
          viewListingNotice:
            'Mangyaring tingnan ang listahan para sa pinakabagong impormasyon',
        },
        singleUseCodeEmail: {
          message:
            'Gamitin ang sumusunod na code upang mag-sign in sa iyong Doorway account. Ang code na ito ay magiging wasto sa loob ng 10 minuto. Huwag kailanman ibahagi ang code na ito.',
          greeting: 'Hi',
          singleUseCode: '%{singleUseCode}',
        },
        t: {
          hello: 'Kamusta',
          seeListing: 'Tingnan ang listahan',
        },
      },
      true,
    );

    await this.markScriptAsComplete(
      'reset missing translations',
      requestingUser,
    );
    return { success: true };
  }

  resolveHideFromListings(pref): boolean {
    if (pref.form_metadata && 'hideFromListing' in pref.form_metadata) {
      if (pref.form_metadata.hideFromListing) {
        return true;
      }
      return false;
    }
    return null;
  }

  resolveOptionValues(formMetaData, type, juris, translations) {
    let optOutText = null;
    const options = [];
    let shouldPush = true;

    formMetaData?.options?.forEach((option, index) => {
      const toPush: Record<string, any> = {
        ordinal: index + 1,
        text: this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.label`,
          juris,
          translations,
        ),
      };

      if (
        option.exclusive &&
        formMetaData.hideGenericDecline &&
        index !== formMetaData.options.length - 1
      ) {
        // for all but the last exlusive option push into options array
        toPush.exclusive = true;
      } else if (
        option.exclusive &&
        formMetaData.hideGenericDecline &&
        index === formMetaData.options.length - 1
      ) {
        // for the last exclusive option add as optOutText
        optOutText = this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.label`,
          juris,
          translations,
        );
        shouldPush = false;
      }

      if (option.description) {
        toPush.description = this.getTranslated(
          type,
          formMetaData.key,
          option.key === 'preferNotToSay'
            ? 'preferNotToSay'
            : `${option.key}.description`,
          juris,
          translations,
        );
      }

      if (option?.extraData.some((extraData) => extraData.type === 'address')) {
        toPush.collectAddress = true;
      }

      if (shouldPush) {
        options.push(toPush);
      } else {
        shouldPush = true;
      }
    });

    return {
      optOutText,
      options: options.length ? options : null,
    };
  }

  getTranslated(type, prefKey, translationKey, juris, translations) {
    let searchKey = `application.${type}.${prefKey}.${translationKey}`;
    if (translationKey === 'preferNotToSay') {
      searchKey = 't.preferNotToSay';
    }

    if (juris === 'Detroit') {
      if (translations['detroitPublic'][searchKey]) {
        return translations['detroitPublic'][searchKey];
      } else if (translations['detroitPartners'][searchKey]) {
        return translations['detroitPartners'][searchKey];
      } else if (translations['detroitCore'][searchKey]) {
        return translations['detroitCore'][searchKey];
      }
    }

    if (translations['generalPublic'][searchKey]) {
      return translations['generalPublic'][searchKey];
    } else if (translations['generalPartners'][searchKey]) {
      return translations['generalPartners'][searchKey];
    } else if (translations['generalCore'][searchKey]) {
      return translations['generalCore'][searchKey];
    }
    return 'no translation';
  }

  getTranslationFile(url) {
    return new Promise((resolve, reject) =>
      https
        .get(url, (res) => {
          let body = '';

          res.on('data', (chunk) => {
            body += chunk;
          });

          res.on('end', () => {
            try {
              const json = JSON.parse(body);
              resolve(json);
            } catch (error) {
              console.error('on end error:', error.message);
              reject(`parsing broke: ${url}`);
            }
          });
        })
        .on('error', (error) => {
          console.error('on error error:', error.message);
          reject(`getting broke: ${url}`);
        }),
    );
  }
}
