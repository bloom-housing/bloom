import {
  ArgumentMetadata,
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ListingsStatusEnum, UnitTypeEnum } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import { User } from '../dtos/users/user.dto';
import { ListingCsvUploadResult } from '../dtos/listings/listing-csv-upload-result.dto';
import { ListingCreateUpdateValidationPipe } from '../validation-pipes/listing-create-update-pipe';
import { ListingService } from './listing.service';
import { PrismaService } from './prisma.service';

type CsvRow = Record<string, string>;

interface ListingRowGroup {
  firstRow: number;
  rows: CsvRow[];
}

/*
  Accepts raw CSV text where each row represents one unit, and rows sharing
  the same listingRowId column are grouped into a single listing. Each group
  is validated and created individually via ListingService.create, so a bad
  row does not prevent the rest of the file from being imported.
*/
@Injectable()
export class ListingCsvImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingService: ListingService,
    private readonly validationPipe: ListingCreateUpdateValidationPipe,
    @Inject(Logger)
    private logger = new Logger(ListingCsvImportService.name),
  ) {}

  async importCsv(
    csvData: string,
    requestingUser: User,
    jurisdictionId: string,
  ): Promise<ListingCsvUploadResult> {
    const jurisdiction = await this.prisma.jurisdictions.findUnique({
      where: { id: jurisdictionId },
    });

    if (!jurisdiction) {
      throw new BadRequestException(
        `Jurisdiction with id "${jurisdictionId}" does not exist`,
      );
    }
    const groups = this.parseAndGroupRows(csvData);

    const result: ListingCsvUploadResult = { created: [], errors: [] };
    const unitTypeCache = new Map<string, string | null>();

    for (const [listingRowId, group] of groups) {
      try {
        const listingCreate = await this.buildListingCreate(
          group.rows,
          unitTypeCache,
          jurisdictionId,
        );
        const validated = await this.validationPipe.transform(listingCreate, {
          type: 'body',
        } as ArgumentMetadata);
        const listing = await this.listingService.create(
          validated,
          requestingUser,
        );
        result.created.push({
          row: group.firstRow,
          listingRowId,
          id: listing.id,
        });
      } catch (e) {
        this.logger.error(
          `Failed to import listingRowId "${listingRowId}" at row ${
            group.firstRow
          }: ${this.formatError(e)}`,
        );
        result.errors.push({
          row: group.firstRow,
          listingRowId,
          message: this.formatError(e),
        });
      }
    }
    this.logger.log(`successfully imported ${result.created.length} listings`);

    return result;
  }

  private parseAndGroupRows(csvData: string): Map<string, ListingRowGroup> {
    let rows: CsvRow[];
    try {
      rows = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        bom: true,
      });
    } catch (e) {
      throw new BadRequestException(`Unable to parse CSV: ${e.message}`);
    }

    if (!rows.length) {
      throw new BadRequestException('CSV contains no data rows');
    }
    if (!('listingRowId' in rows[0])) {
      throw new BadRequestException(
        'CSV is missing the required listingRowId column',
      );
    }

    const groups = new Map<string, ListingRowGroup>();
    rows.forEach((row, index) => {
      const listingRowId = row.listingRowId?.trim();
      if (!listingRowId) {
        return;
      }
      const csvRowNumber = index + 2; // +1 for 1-indexing, +1 for the header row
      const group = groups.get(listingRowId);
      if (group) {
        group.rows.push(row);
      } else {
        groups.set(listingRowId, { firstRow: csvRowNumber, rows: [row] });
      }
    });

    return groups;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async buildListingCreate(
    rows: CsvRow[],
    unitTypeCache: Map<string, string | null>,
    jurisdictionId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    const first = rows[0];

    const units = [];
    for (const row of rows) {
      const unit = await this.buildUnit(row, unitTypeCache);
      if (unit) {
        units.push(unit);
      }
    }

    return {
      jurisdictions: { id: jurisdictionId },
      // All listings imported via CSV are created in the draft state, and must be reviewed and published by a user before they are visible to the public.
      status: ListingsStatusEnum.pending,
      name: this.trimStr(first.name),
      developer: this.trimStr(first.developer),
      managementWebsite: this.trimStr(first.managementWebsite),
      neighborhood: this.trimStr(first.neighborhood),
      yearBuilt: this.convertToNumber(first.yearBuilt),
      buildingTotalUnits: this.convertToNumber(first.buildingTotalUnits),
      petPolicy: this.trimStr(first.petPolicy),
      smokingPolicy: this.trimStr(first.smokingPolicy),
      unitAmenities: this.trimStr(first.unitAmenities),
      amenities: this.trimStr(first.amenities),
      accessibility: this.trimStr(first.accessibility),
      servicesOffered: this.trimStr(first.servicesOffered),
      specialNotes: this.trimStr(first.specialNotes),
      whatToExpect: this.trimStr(first.whatToExpect),
      rentalHistory: this.trimStr(first.rentalHistory),
      creditHistory: this.trimStr(first.creditHistory),
      criminalBackground: this.trimStr(first.criminalBackground),
      rentalAssistance: this.trimStr(first.rentalAssistance),
      leasingAgentName: this.trimStr(first.leasingAgentName),
      leasingAgentEmail: this.trimStr(first.leasingAgentEmail),
      leasingAgentPhone: this.trimStr(first.leasingAgentPhone),
      leasingAgentTitle: this.trimStr(first.leasingAgentTitle),
      leasingAgentOfficeHours: this.trimStr(first.leasingAgentOfficeHours),
      reviewOrderType: this.trimStr(first.reviewOrderType),
      homeType: this.trimStr(first.homeType),
      listingType: this.trimStr(first.listingType),
      region: this.trimStr(first.region),
      digitalApplication: this.convertToBool(first.digitalApplication),
      paperApplication: this.convertToBool(first.paperApplication),
      section8Acceptance: this.convertToBool(first.section8Acceptance),
      isWaitlistOpen: this.convertToBool(first.isWaitlistOpen),
      displayWaitlistSize:
        this.convertToBool(first.displayWaitlistSize) ?? false,
      waitlistMaxSize: this.convertToNumber(first.waitlistMaxSize),
      waitlistCurrentSize: this.convertToNumber(first.waitlistCurrentSize),
      waitlistOpenSpots: this.convertToNumber(first.waitlistOpenSpots),
      listingsBuildingAddress: this.buildAddress(first),
      listingMultiselectQuestions: [],
      units,
    };
  }

  private buildAddress(row: CsvRow) {
    const fields = [
      row.buildingAddressStreet,
      row.buildingAddressStreet2,
      row.buildingAddressCity,
      row.buildingAddressState,
      row.buildingAddressZip,
      row.buildingAddressCounty,
      row.buildingAddressLatitude,
      row.buildingAddressLongitude,
    ];
    if (!fields.some((value) => value?.trim())) {
      return undefined;
    }

    return {
      street: this.trimStr(row.buildingAddressStreet),
      street2: this.trimStr(row.buildingAddressStreet2),
      city: this.trimStr(row.buildingAddressCity),
      state: this.trimStr(row.buildingAddressState),
      zipCode: this.trimStr(row.buildingAddressZip),
      county: this.trimStr(row.buildingAddressCounty),
      latitude: this.convertToNumber(row.buildingAddressLatitude),
      longitude: this.convertToNumber(row.buildingAddressLongitude),
    };
  }

  private async buildUnit(
    row: CsvRow,
    unitTypeCache: Map<string, string | null>,
  ) {
    const fields = [
      row.unitType,
      row.unitNumber,
      row.monthlyRent,
      row.sqFeet,
      row.numBedrooms,
      row.numBathrooms,
    ];
    if (!fields.some((value) => value?.trim())) {
      return undefined;
    }

    const unitTypeName = this.trimStr(row.unitType);
    let unitTypes;
    if (unitTypeName) {
      unitTypes = {
        id: await this.resolveUnitTypeId(unitTypeName, unitTypeCache),
      };
    }

    return {
      unitTypes,
      number: this.trimStr(row.unitNumber),
      floor: this.convertToNumber(row.floor),
      sqFeet: this.trimStr(row.sqFeet),
      numBathrooms: this.convertToNumber(row.numBathrooms),
      numBedrooms: this.convertToNumber(row.numBedrooms),
      minOccupancy: this.convertToNumber(row.minOccupancy),
      maxOccupancy: this.convertToNumber(row.maxOccupancy),
      monthlyRent: this.trimStr(row.monthlyRent),
      monthlyRentAsPercentOfIncome: this.trimStr(
        row.monthlyRentAsPercentOfIncome,
      ),
      amiPercentage: this.trimStr(row.amiPercentage),
    };
  }

  private async resolveUnitTypeId(
    unitTypeName: string,
    unitTypeCache: Map<string, string | null>,
  ): Promise<string> {
    if (!unitTypeCache.has(unitTypeName)) {
      const match = await this.prisma.unitTypes.findFirst({
        where: { name: unitTypeName as UnitTypeEnum },
      });
      unitTypeCache.set(unitTypeName, match?.id ?? null);
    }
    const unitTypeId = unitTypeCache.get(unitTypeName);
    if (!unitTypeId) {
      throw new Error(`Unknown unitType "${unitTypeName}"`);
    }
    return unitTypeId;
  }

  private trimStr(value?: string): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  private convertToNumber(value?: string): number | string | undefined {
    const trimmed = this.trimStr(value);
    if (!trimmed) {
      return undefined;
    }
    const parsed = Number(trimmed);

    return Number.isNaN(parsed) ? trimmed : parsed;
  }

  private convertToBool(value?: string): boolean | string | undefined {
    const trimmed = this.trimStr(value)?.toLowerCase();
    if (!trimmed) {
      return undefined;
    }
    if (['true', '1', 'yes'].includes(trimmed)) {
      return true;
    }
    if (['false', '0', 'no'].includes(trimmed)) {
      return false;
    }
    // Fall through the raw string so IsBoolean reports a clear error.
    return trimmed;
  }

  private formatError(e: unknown): string {
    if (e instanceof HttpException) {
      const response = e.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (response && typeof response === 'object' && 'message' in response) {
        const message = (response as { message: unknown }).message;
        return Array.isArray(message) ? message.join('; ') : String(message);
      }
    }
    if (e instanceof Error) {
      return e.message;
    }
    return 'Unknown error';
  }
}
