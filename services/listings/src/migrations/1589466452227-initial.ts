import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1589466452227 implements MigrationInterface {
    name = 'initial1589466452227'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unit_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amiPercentage" character varying, "annualIncomeMin" character varying, "monthlyIncomeMin" numeric(8,2), "floor" integer, "annualIncomeMax" character varying, "maxOccupancy" integer, "minOccupancy" integer, "monthlyRent" numeric(8,2), "numBathrooms" integer, "numBedrooms" integer, "number" character varying, "priorityType" character varying, "reservedType" character varying, "sqFeet" numeric(8,2), "status" character varying, "unitType" character varying, "createdAt" TIMESTAMP, "updatedAt" TIMESTAMP, "amiChartId" integer, "monthlyRentAsPercentOfIncome" numeric(8,2), "listingId" uuid, CONSTRAINT "PK_d5d4571fd33aa3c5b5ccb2590b4" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "preference" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ordinal" character varying, "title" character varying, "subtitle" character varying, "description" character varying, "links" jsonb, "listingId" uuid, CONSTRAINT "PK_5c4cbf49a1e97dcbc695bf462a6" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "listing_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "acceptingApplicationsAtLeasingAgent" boolean, "acceptingApplicationsByPoBox" boolean, "acceptingOnlineApplications" boolean, "acceptsPostmarkedApplications" boolean, "accessibility" character varying, "amenities" character varying, "applicationDueDate" character varying, "applicationOpenDate" character varying, "applicationFee" character varying, "applicationOrganization" character varying, "applicationAddress" jsonb, "blankPaperApplicationCanBePickedUp" boolean, "buildingAddress" jsonb, "buildingTotalUnits" integer, "buildingSelectionCriteria" character varying, "costsNotIncluded" character varying, "creditHistory" character varying, "criminalBackground" character varying, "depositMin" character varying, "depositMax" character varying, "developer" character varying, "disableUnitsAccordion" boolean, "imageUrl" character varying, "leasingAgentAddress" jsonb, "leasingAgentEmail" character varying, "leasingAgentName" character varying, "leasingAgentOfficeHours" character varying, "leasingAgentPhone" character varying, "leasingAgentTitle" character varying, "name" character varying, "neighborhood" character varying, "petPolicy" character varying, "postmarkedApplicationsReceivedByDate" character varying, "programRules" character varying, "rentalHistory" character varying, "requiredDocuments" character varying, "smokingPolicy" character varying, "unitsAvailable" integer, "unitAmenities" character varying, "waitlistCurrentSize" integer, "waitlistMaxSize" integer, "yearBuilt" integer, CONSTRAINT "PK_788a58bfed686149230d16ab6f3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TYPE "attachment_model_type_enum" AS ENUM('1', '2')`, undefined);
        await queryRunner.query(`CREATE TABLE "attachment_model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "label" character varying, "fileUrl" character varying, "type" "attachment_model_type_enum", "listingId" uuid, CONSTRAINT "PK_e81823b713a01f1da6a243cabac" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "unit_model" ADD CONSTRAINT "FK_900ff4bdd058b6615830fedf2c1" FOREIGN KEY ("listingId") REFERENCES "listing_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "preference" ADD CONSTRAINT "FK_51fe73ffef034575b41bc43ffea" FOREIGN KEY ("listingId") REFERENCES "listing_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "attachment_model" ADD CONSTRAINT "FK_4339649d2c5781baec213885dcd" FOREIGN KEY ("listingId") REFERENCES "listing_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachment_model" DROP CONSTRAINT "FK_4339649d2c5781baec213885dcd"`, undefined);
        await queryRunner.query(`ALTER TABLE "preference" DROP CONSTRAINT "FK_51fe73ffef034575b41bc43ffea"`, undefined);
        await queryRunner.query(`ALTER TABLE "unit_model" DROP CONSTRAINT "FK_900ff4bdd058b6615830fedf2c1"`, undefined);
        await queryRunner.query(`DROP TABLE "attachment_model"`, undefined);
        await queryRunner.query(`DROP TYPE "attachment_model_type_enum"`, undefined);
        await queryRunner.query(`DROP TABLE "listing_model"`, undefined);
        await queryRunner.query(`DROP TABLE "preference"`, undefined);
        await queryRunner.query(`DROP TABLE "unit_model"`, undefined);
    }

}
