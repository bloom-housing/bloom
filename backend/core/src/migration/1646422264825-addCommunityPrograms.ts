import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommunityPrograms1646422264825 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const [{ id }] = await queryRunner.query(`SELECT id FROM jurisdictions WHERE name = 'Detroit'`)

        await queryRunner.query(
            `INSERT INTO programs (title, description)
                VALUES
                    ('Seniors 55+', 'This property offers housing for residents ages 55 and older.'),
                    ('Seniors 62+', 'This property offers housing for residents ages 62 and older.'),
                    ('Residents with Disabilities', 'This property has reserved a large portion of its units for residents with disabilities. Contact this property to see if you qualify.'),
                    ('Families', 'This property offers housing for families. Ask the property if there are additional requirements to qualify as a family.'),
                    ('Supportive Housing for the Homeless', 'This property offers housing for those experiencing homelessness, and may require additional processes that applicants need to go through in order to qualify.'),
                    ('Veterans', 'This property offers housing for those who have served in the military, naval, or air service.')
            `
        )
        
        const res = await queryRunner.query(`SELECT id from programs WHERE title in ('Seniors 55+', 'Seniors 62+', 'Residents with Disabilities', 'Families', 'Supportive Housing for the Homeless', 'Veterans')`)

        for (const program of res) {
            await queryRunner.query(
                `INSERT INTO jurisdictions_programs_programs (jurisdictions_id, programs_id)
                    VALUES ($1, $2)
                `,
                [id, program.id]
            )
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
