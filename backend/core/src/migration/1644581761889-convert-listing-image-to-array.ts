import { MigrationInterface, QueryRunner } from "typeorm"

export class convertListingImageToArray1644581761889 implements MigrationInterface {
  name = "convertListingImageToArray1644581761889"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_ecc271b96bd18df0efe47b85186"`
    )
    await queryRunner.query(
      `CREATE TABLE "listing_images" ("ordinal" integer, "listing_id" uuid NOT NULL, "image_id" uuid NOT NULL, CONSTRAINT "PK_beb1c8e9f64f578908135aa6899" PRIMARY KEY ("listing_id", "image_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_94041359df3c1b14c4420808d1" ON "listing_images" ("listing_id") `
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    const listings: [{ id: string; image_id: string }] = await queryRunner.query(
      `SELECT id, image_id FROM listings where image_id is not null`
    )
    for (const l of listings) {
      await queryRunner.query(`INSERT INTO listing_images (listing_id, image_id) VALUES ($1, $2)`, [
        l.id,
        l.image_id,
      ])
    }
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "image_id"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_94041359df3c1b14c4420808d16"`
    )
    await queryRunner.query(`ALTER TABLE "listings" ADD "image_id" uuid`)
    await queryRunner.query(`DROP INDEX "IDX_94041359df3c1b14c4420808d1"`)
    await queryRunner.query(`DROP TABLE "listing_images"`)
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_ecc271b96bd18df0efe47b85186" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
