import { MigrationInterface, QueryRunner } from "typeorm"

export class userRoleUpdates1656362047737 implements MigrationInterface {
  name = "userRoleUpdates1656362047737"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            UPDATE user_roles
            SET 
                is_admin = true,
                is_partner = false,
                is_jurisdictional_admin = false
            WHERE is_admin = true;

            UPDATE user_roles
            SET 
                is_admin = false,
                is_partner = false,
                is_jurisdictional_admin = true
            WHERE is_jurisdictional_admin = true;
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
