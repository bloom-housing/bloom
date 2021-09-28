import { MigrationInterface, QueryRunner } from "typeorm"

export class addJurisdictionRelationToReservedCommunityType1632850106492
  implements MigrationInterface {
  name = "addJurisdictionRelationToReservedCommunityType1632850106492"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reserved_community_types" ADD "jurisdiction_id" uuid`)
    const [{ id: jurisdictionId }] = await queryRunner.query(`SELECT id FROM jurisdictions LIMIT 1`)
    await queryRunner.query(`UPDATE reserved_community_types SET jurisdiction_id = $1`, [
      jurisdictionId,
    ])
    await queryRunner.query(
      `ALTER TABLE "reserved_community_types" ALTER COLUMN "jurisdiction_id" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "reserved_community_types" ADD CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc" FOREIGN KEY ("jurisdiction_id") REFERENCES "jurisdictions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reserved_community_types" DROP CONSTRAINT "FK_8b43c85a0dd0c39ca795c369edc"`
    )
    await queryRunner.query(`ALTER TABLE "reserved_community_types" DROP COLUMN "jurisdiction_id"`)
  }
}
