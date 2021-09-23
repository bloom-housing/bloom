import {MigrationInterface, QueryRunner} from "typeorm";

export class setApplicationMethodBooleans1632431578257 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // get application methods
        const methods = await queryRunner.query(`
            SELECT type, listing_id
            FROM application_methods
        `)

        for (const method of methods) {
            if (method.type = "Internal") {
                await queryRunner.query(`
                    UPDATE listings
                    SET digital_application = $1,
                        common_digital_application = $2
                    WHERE id = $3
                `, [true, true, method.listing_id])
            } else if (method.type = "ExternalLink") {
                await queryRunner.query(`
                    UPDATE listings
                    SET digital_application = $1,
                        common_digital_application = $2
                    WHERE id = $3
                `, [true, false, method.listing_id])
            } else if (method.type = "PaperPickup") {
                await queryRunner.query(`
                    UPDATE listings
                    SET paper_application = $1
                    WHERE id = $2
                `, [true, method.listing_id])
            } else if (method.type = "Referral") {
                await queryRunner.query(`
                    UPDATE listings
                    SET referral_opportunity = $1
                    WHERE id = $2
                `, [true, method.listing_id])
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
