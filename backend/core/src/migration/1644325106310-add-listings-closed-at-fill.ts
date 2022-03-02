import { MigrationInterface, QueryRunner } from "typeorm"

export class addListingsClosedAtFill1644325106310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE listings SET closed_at = application_due_date WHERE closed_at is null`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
