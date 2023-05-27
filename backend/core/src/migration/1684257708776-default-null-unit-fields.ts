import { MigrationInterface, QueryRunner } from "typeorm"

export class defaultNullUnitFields1684257708776 implements MigrationInterface {
  name = "defaultNullUnitFields1684257708776"

  public async up(queryRunner: QueryRunner): Promise<void> {
    const unitFields = ["num_bathrooms", "floor", "max_occupancy", "min_occupancy"]
    for (const field of unitFields) {
      await queryRunner.query(`UPDATE units SET ${field} = NULL WHERE ${field} = 0`)
    }
  }
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
