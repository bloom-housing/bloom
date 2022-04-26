import { MigrationInterface, QueryRunner } from "typeorm"

export class alamedaProgramsAndPreferences1650934163344 implements MigrationInterface {
  name = "alamedaProgramsAndPreferences1650934163344"
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
            INSERT INTO programs(title, subtitle, description, form_metadata)
            SELECT 
              'State of California - Veterans Housing and Homelessness Prevention Program (VHHP)' as title,
              '' as subtitle,
              'Does anyone in your household meet the following eligibility requirements? (check all that apply)' as description,
              '{"key":"VHHP","type":"checkbox","options":[{"key":"veteran","extraData":[],"description":true},{"key":"veteranStatus","extraData":[],"description":true}]}' as form_metadata
            ;
    
            INSERT INTO preferences(title, subtitle, description, form_metadata)
            SELECT 
              'Oakland Housing Authority Preferences' as title,
              '' as subtitle,
              'Does anyone in your household satisfy any of the following preferences? (check all that apply)' as description,
              '{"hideFromListing": true,"key":"oaklandHousingAuthority","type":"checkbox","options":[{"key":"liveOrWork","extraData":[],"description":true},{"key":"family","extraData":[],"description":true},{"key":"veteran","extraData":[],"description":true}]}' as form_metadata
            ;
    
            INSERT INTO preferences(title, subtitle, description, form_metadata)
            SELECT 
              'South Alameda County Region Housing Preferences' as title,
              '' as subtitle,
              'Does anyone in your household satisfy any of the following preferences? (check all that apply): ' as description,
              '{"key":"southAlamedaCounty","type":"checkbox","options":[
                  {"key":"live","extraData":[],"description":true},
                  {"key":"work","extraData":[{"key":"address","type":"address"}],"description":true}
              ]}' as form_metadata
            ;
          `
    )

    let jurisdiction = await queryRunner.query(
      `
            SELECT
              id
            FROM jurisdictions
            WHERE name = 'Alameda';
          `
    )
    jurisdiction = jurisdiction[0].id

    let program = await queryRunner.query(
      `
            SELECT
              id
            FROM programs
            WHERE title = 'State of California - Veterans Housing and Homelessness Prevention Program (VHHP)';
          `
    )
    program = program[0].id

    let oakland = await queryRunner.query(
      `
            SELECT
              id
            FROM preferences
            WHERE title = 'Oakland Housing Authority Preferences';
          `
    )
    oakland = oakland[0].id

    let southAlameda = await queryRunner.query(
      `
            SELECT
              id
            FROM preferences
            WHERE title = 'South Alameda County Region Housing Preferences';
          `
    )
    southAlameda = southAlameda[0].id

    await queryRunner.query(
      `
            INSERT INTO jurisdictions_programs_programs
            SELECT '${jurisdiction}' as jurisdictions_id,
            '${program}' as program_id
            ;
            
            INSERT INTO jurisdictions_preferences_preferences
            SELECT '${jurisdiction}' as jurisdictions_id,
            '${oakland}' as preference_id
            ;
            
            INSERT INTO jurisdictions_preferences_preferences
            SELECT '${jurisdiction}' as jurisdictions_id,
            '${southAlameda}' as preference_id
            ;
          `
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
