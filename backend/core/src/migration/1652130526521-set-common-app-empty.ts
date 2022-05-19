import { MigrationInterface, QueryRunner } from "typeorm"

export class setCommonAppEmpty1652130526521 implements MigrationInterface {
  name = "setCommonAppEmpty1652130526521"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`UPDATE "listings" SET common_digital_application = ($1)`, [false])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
