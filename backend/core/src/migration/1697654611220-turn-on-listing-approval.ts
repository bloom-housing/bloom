import { MigrationInterface, QueryRunner } from "typeorm"
import { EnumJurisdictionListingApprovalPermissions } from "../../types"

export class turnOnListingApproval1697654611220 implements MigrationInterface {
  name = "turnOnListingApproval1697654611220"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const jurisdictions: { id: string }[] = await queryRunner.query(`
        SELECT id
        FROM jurisdictions
    `)

    const approvalPermissions = [
      EnumJurisdictionListingApprovalPermissions.admin,
      EnumJurisdictionListingApprovalPermissions.jurisdictionAdmin,
    ].map((permission) => `'${permission}'::jurisdictions_listing_approval_permissions_enum`)
      
    jurisdictions.forEach(async (jurisdictionId) => {
      await queryRunner.query(`
            UPDATE jurisdictions
            SET listing_approval_permissions = ARRAY [${approvalPermissions}]
            WHERE id = '${jurisdictionId.id}'
          `)
    })
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no down migration
  }
}
