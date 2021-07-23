import { MigrationInterface, QueryRunner } from "typeorm"

export class fixIntegerTypes1603364073148 implements MigrationInterface {
  name = "fixIntegerTypes1603364073148"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "floor" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "max_occupancy" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "min_occupancy" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "num_bathrooms" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "num_bedrooms" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "ami_chart_id" TYPE integer`)
    await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "ordinal" TYPE integer`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "floor" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "max_occupancy" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "min_occupancy" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "num_bathrooms" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "num_bedrooms" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "ami_chart_id" TYPE numeric`)
    await queryRunner.query(`ALTER TABLE "preferences" ALTER COLUMN "ordinal" TYPE numeric`)
  }
}
