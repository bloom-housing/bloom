import {MigrationInterface, QueryRunner} from "typeorm";
import { Address } from "../shared/entities/address.entity"

export class convertListingAddressesJsonbsToTables1626258763008 implements MigrationInterface {
    name = 'convertListingAddressesJsonbsToTables1626258763008'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_pick_up_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_drop_off_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_mailing_address_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "leasing_agent_address_id" uuid`);

        const listings = await queryRunner.query(`SELECT id, application_address, leasing_agent_address, application_pick_up_address, application_mailing_address, application_drop_off_address FROM listings`)
        for(const listing of listings) {
            const addressKeys = ["application_address", "leasing_agent_address", "application_pick_up_address", "application_mailing_address", "application_drop_off_address"]
            for(const addressKey of addressKeys) {
                if (listing[addressKey]) {
                    const addr = listing[addressKey] as Address
                    const [addrId] = await queryRunner.query(`INSERT INTO "address" (place_name, city, county, state, street, street2, zip_code, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`, [
                      addr.placeName, addr.city, addr.county, addr.state, addr.street, addr.street2, addr.zipCode, addr.latitude, addr.longitude
                    ]);
                    await queryRunner.query(`UPDATE listings SET ${addressKey}_id = ($1) WHERE id = ($2)`, [addrId.id, listing.id])
                }
            }
        }

        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_address"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "leasing_agent_address"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_pick_up_address"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_mailing_address"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_drop_off_address"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_42385e47be1780d1491f0c8c1c3" FOREIGN KEY ("application_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_d54596fd877e83a3126d3953f36" FOREIGN KEY ("application_pick_up_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6" FOREIGN KEY ("application_drop_off_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec" FOREIGN KEY ("application_mailing_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156" FOREIGN KEY ("leasing_agent_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_8a93cc462d190d3f1a04fa69156"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_7cedb0a800e3c0af7ede27ab1ec"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_17e861d96c1bde13c1f4c344cb6"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_d54596fd877e83a3126d3953f36"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_42385e47be1780d1491f0c8c1c3"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "leasing_agent_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_mailing_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_drop_off_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_pick_up_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_address_id"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_drop_off_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_mailing_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_pick_up_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "leasing_agent_address" jsonb`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "application_address" jsonb`);
    }

}
