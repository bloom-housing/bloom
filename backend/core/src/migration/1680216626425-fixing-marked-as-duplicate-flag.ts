import { MigrationInterface, QueryRunner } from "typeorm"

export class fixingMarkedAsDuplicateFlag1680216626425 implements MigrationInterface {
  name = "fixingMarkedAsDuplicateFlag1680216626425"

  public async up(queryRunner: QueryRunner): Promise<void> {
    // if review status is duplicate markedAsDuplicate should be true
    await queryRunner.query(`
            UPDATE applications
            SET marked_as_duplicate = true
            WHERE review_status = 'duplicate'
        `)
    // if review status is not duplicate markedAsDuplicate should be false
    await queryRunner.query(`
            UPDATE applications
            SET marked_as_duplicate = false
            WHERE review_status != 'duplicate'
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
