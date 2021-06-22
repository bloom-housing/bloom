import {MigrationInterface, QueryRunner} from "typeorm";

export class addReservedCommunityTypesTable1624359766509 implements MigrationInterface {
    name = 'addReservedCommunityTypesTable1624359766509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reserved_community_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text, CONSTRAINT "PK_af3937276e7bb53c30159d6ca0b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "reserved_community_min_age" integer`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "reserved_community_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_1f6fac73d27c81b656cc6100267" FOREIGN KEY ("reserved_community_type_id") REFERENCES "reserved_community_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_1f6fac73d27c81b656cc6100267"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "reserved_community_type_id"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "reserved_community_min_age"`);
        await queryRunner.query(`DROP TABLE "reserved_community_types"`);
    }

}
