import {MigrationInterface, QueryRunner} from "typeorm";

export class listingStatusEnumClosed1623279600284 implements MigrationInterface {
    name = 'listingStatusEnumClosed1623279600284'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."listings_status_enum" RENAME TO "listings_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "listings_status_enum" AS ENUM('active', 'pending', 'closed')`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" TYPE "listings_status_enum" USING "status"::"text"::"listings_status_enum"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "listings_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "listings_status_enum_old" AS ENUM('active', 'pending')`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" TYPE "listings_status_enum_old" USING "status"::"text"::"listings_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "listings_status_enum"`);
        await queryRunner.query(`ALTER TYPE "listings_status_enum_old" RENAME TO  "listings_status_enum"`);
    }

}
