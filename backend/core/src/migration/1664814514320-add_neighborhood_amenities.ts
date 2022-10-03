import { MigrationInterface, QueryRunner } from "typeorm"

export class addNeighborhoodAmenities1664814514320 implements MigrationInterface {
  name = "addNeighborhoodAmenities1664814514320"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "listing_neighborhood_amenities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "grocery" text, "pharmacy" text, "medical_clinic" text, "park" text, "senior_center" text, CONSTRAINT "PK_4822e277c626fd1d94cddbb9826" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "neighborhood_amenities_id" uuid`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "UQ_59b4618dfbe6dca2edda375b8d3" UNIQUE ("neighborhood_amenities_id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_59b4618dfbe6dca2edda375b8d3" FOREIGN KEY ("neighborhood_amenities_id") REFERENCES "listing_neighborhood_amenities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_59b4618dfbe6dca2edda375b8d3"`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "UQ_59b4618dfbe6dca2edda375b8d3"`
    )
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "neighborhood_amenities_id"`)
    await queryRunner.query(`DROP TABLE "listing_neighborhood_amenities"`)
  }
}
