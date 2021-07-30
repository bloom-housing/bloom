import { MigrationInterface, QueryRunner } from "typeorm"

export class changeApplicationsMethodsFromJsonbToSeparateTable1626703818188
  implements MigrationInterface {
  name = "changeApplicationsMethodsFromJsonbToSeparateTable1626703818188"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "application_methods" ADD "file_id" uuid`)
    await queryRunner.query(
      `ALTER TYPE "application_methods_type_enum" RENAME TO "application_methods_type_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "application_methods_type_enum" AS ENUM('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup')`
    )
    await queryRunner.query(
      `ALTER TABLE "application_methods" ALTER COLUMN "type" TYPE "application_methods_type_enum" USING "type"::"text"::"application_methods_type_enum"`
    )
    await queryRunner.query(`DROP TYPE "application_methods_type_enum_old"`)
    await queryRunner.query(
      `ALTER TABLE "application_methods" ADD CONSTRAINT "FK_b629c3b2549f33a911bcc84b65b" FOREIGN KEY ("file_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    const listings = await queryRunner.query(`SELECT id, application_methods FROM listings`)
    for (const listing of listings) {
      for (const applicationMethod of listing.application_methods) {
        await queryRunner.query(
          `INSERT INTO application_methods (type, label, external_reference, accepts_postmarked_applications, listing_id) VALUES ($1, $2, $3, $4, $5)`,
          [
            applicationMethod.type,
            applicationMethod.label,
            applicationMethod.externalReference,
            applicationMethod.acceptsPostmarkedApplications,
            listing.id,
          ]
        )
      }
    }
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "application_methods"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "application_methods" DROP CONSTRAINT "FK_b629c3b2549f33a911bcc84b65b"`
    )
    await queryRunner.query(
      `CREATE TYPE "application_methods_type_enum_old" AS ENUM('Internal', 'FileDownload', 'ExternalLink', 'PaperPickup', 'POBox', 'LeasingAgent')`
    )
    await queryRunner.query(
      `ALTER TABLE "application_methods" ALTER COLUMN "type" TYPE "application_methods_type_enum_old" USING "type"::"text"::"application_methods_type_enum_old"`
    )
    await queryRunner.query(`DROP TYPE "application_methods_type_enum"`)
    await queryRunner.query(
      `ALTER TYPE "application_methods_type_enum_old" RENAME TO "application_methods_type_enum"`
    )
    await queryRunner.query(`ALTER TABLE "application_methods" DROP COLUMN "file_id"`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "application_methods" jsonb NOT NULL`)
  }
}
