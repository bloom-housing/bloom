import { MigrationInterface, QueryRunner } from "typeorm"

export class closeOverdueListings1649260977278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE listings set status = 'closed' where application_due_date < NOW() AND status != 'pending'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
