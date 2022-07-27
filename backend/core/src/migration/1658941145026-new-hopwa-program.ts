import { MigrationInterface, QueryRunner } from "typeorm"

export class newHopwaProgram1658941145026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const jurisdiction = await queryRunner.query(
      `
                      SELECT
                        id
                      FROM jurisdictions
                      WHERE name = 'Alameda';
                    `
    )
    await queryRunner.query(
      `
                      INSERT INTO programs(title, subtitle, description, form_metadata)
                      SELECT
                        'Housing Opportunities for Persons with AIDS (HOPWA)' as title,
                        'There are apartments set-aside for households eligible for the HOPWA program (Housing Opportunities for Persons with AIDS), which are households where a person has been medically diagnosed with HIV/AIDS. These apartments also have Project-Based Section rental subsidies (tenant pays 30% of household income). If you have questions about HOPWA eligibility or need support in submitting this application, please contact AHIP (AIDS Housing Information Project) at (510) 537-2600 or (510) 695-5222.' as subtitle,
                        'Housing Opportunities for Persons with AIDS (HOPWA)' as description,
                        '{"key":"HOPWA","type":"radio","customSelectText":"Please indicate here if you are interested in applying for one of these HOPWA apartments.","options":[{"key":"interested","extraData":[],"description":false},{"key":"notInterested","extraData":[],"description":false}]}' as form_metadata
                      ;
                    `
    )
    const program = await queryRunner.query(
      `
                      SELECT
                        id
                      FROM programs
                      WHERE title = 'Housing Opportunities for Persons with AIDS (HOPWA)';
                    `
    )
    await queryRunner.query(
      `INSERT INTO jurisdictions_programs_programs (jurisdictions_id, programs_id) VALUES ($1, $2)`,
      [jurisdiction[0].id, program[0].id]
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
