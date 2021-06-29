import {MigrationInterface, QueryRunner} from "typeorm";

export class addUnitRentTypesTable1624966092979 implements MigrationInterface {
    name = 'addUnitRentTypesTable1624966092979'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "unit_rent_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_fb6b318fdee0a5b30521f63c516" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "units" ADD "unit_rent_type_id" uuid`);
        await queryRunner.query(`ALTER TABLE "units" ADD CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9" FOREIGN KEY ("unit_rent_type_id") REFERENCES "unit_rent_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        for (const unitRentType of ["fixed", "percentageOfIncome"]) {
            await queryRunner.query(`INSERT INTO "unit_rent_types" (name) VALUES ($1)`, [unitRentType])
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_ff9559bf9a1daecef4a89bad4a9"`);
        await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "unit_rent_type_id"`);
        await queryRunner.query(`DROP TABLE "unit_rent_types"`);
    }

}
