import { MigrationInterface, QueryRunner } from "typeorm"

export class InitialDB1588694149283 implements MigrationInterface {
  name = "InitialDB1588694149283"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "unit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amiPercentage" character varying, "annualIncomeMin" character varying, "monthlyIncomeMin" numeric(8,2), "floor" integer, "annualIncomeMax" character varying, "maxOccupancy" integer, "minOccupancy" integer, "monthlyRent" numeric(8,2), "numBathrooms" integer, "numBedrooms" integer, "number" character varying, "priorityType" character varying, "reservedType" character varying, "sqFeet" numeric(8,2), "status" character varying, "unitType" character varying, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "amiChartId" integer, "monthlyRentAsPercentOfIncome" numeric(8,2), "listingId" uuid, CONSTRAINT "PK_4252c4be609041e559f0c80f58a" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ordinal" character varying, "title" character varying, "subtitle" character varying, "description" character varying, "links" jsonb, "listingId" uuid, CONSTRAINT "PK_5c4cbf49a1e97dcbc695bf462a6" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `CREATE TABLE "listing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "acceptingApplicationsAtLeasingAgent" boolean, "acceptingApplicationsByPoBox" boolean, "acceptingOnlineApplications" boolean, "acceptsPostmarkedApplications" boolean, "accessibility" character varying, "amenities" character varying, "applicationDueDate" character varying, "applicationOpenDate" character varying, "applicationFee" character varying, "applicationOrganization" character varying, "applicationAddress" jsonb, "blankPaperApplicationCanBePickedUp" boolean, "buildingAddress" jsonb, "buildingTotalUnits" integer, "buildingSelectionCriteria" character varying, "costsNotIncluded" character varying, "creditHistory" character varying, "criminalBackground" character varying, "depositMin" character varying, "depositMax" character varying, "developer" character varying, "disableUnitsAccordion" boolean, "imageUrl" character varying, "leasingAgentAddress" jsonb, "leasingAgentEmail" character varying, "leasingAgentName" character varying, "leasingAgentOfficeHours" character varying, "leasingAgentPhone" character varying, "leasingAgentTitle" character varying, "name" character varying, "neighborhood" character varying, "petPolicy" character varying, "postmarkedApplicationsReceivedByDate" character varying, "programRules" character varying, "rentalHistory" character varying, "requiredDocuments" character varying, "smokingPolicy" character varying, "unitsAvailable" integer, "unitAmenities" character varying, "waitlistCurrentSize" integer, "waitlistMaxSize" integer, "yearBuilt" integer, CONSTRAINT "PK_381d45ebb8692362c156d6b87d7" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(`CREATE TYPE "attachment_type_enum" AS ENUM('1', '2')`, undefined)
    await queryRunner.query(
      `CREATE TABLE "attachment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying, "fileUrl" character varying, "type" "attachment_type_enum", "listingId" uuid, CONSTRAINT "PK_d2a80c3a8d467f08a750ac4b420" PRIMARY KEY ("id"))`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "unit" ADD CONSTRAINT "FK_72719e0518e726a1de304c6738e" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "preference" ADD CONSTRAINT "FK_51fe73ffef034575b41bc43ffea" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "attachment" ADD CONSTRAINT "FK_1bf458ab86356614a560142a345" FOREIGN KEY ("listingId") REFERENCES "listing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
      undefined
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "attachment" DROP CONSTRAINT "FK_1bf458ab86356614a560142a345"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "preference" DROP CONSTRAINT "FK_51fe73ffef034575b41bc43ffea"`,
      undefined
    )
    await queryRunner.query(
      `ALTER TABLE "unit" DROP CONSTRAINT "FK_72719e0518e726a1de304c6738e"`,
      undefined
    )
    await queryRunner.query(`DROP TABLE "attachment"`, undefined)
    await queryRunner.query(`DROP TYPE "attachment_type_enum"`, undefined)
    await queryRunner.query(`DROP TABLE "listing"`, undefined)
    await queryRunner.query(`DROP TABLE "preference"`, undefined)
    await queryRunner.query(`DROP TABLE "unit"`, undefined)
  }
}
