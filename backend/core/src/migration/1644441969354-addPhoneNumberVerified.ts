import {MigrationInterface, QueryRunner} from "typeorm";

export class addPhoneNumberVerified1644441969354 implements MigrationInterface {
    name = 'addPhoneNumberVerified1644441969354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ALTER COLUMN "phone_number_verified" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_accounts" ALTER COLUMN "phone_number_verified" DROP DEFAULT`);
    }

}
