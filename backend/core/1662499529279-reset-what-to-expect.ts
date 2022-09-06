import { MigrationInterface, QueryRunner } from "typeorm"

export class resetWhatToExpect1662499529279 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // If what to expect value is not either of the current defaults, keep it, otherwise set it to null
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // There is no reconciliation here
  }
}
