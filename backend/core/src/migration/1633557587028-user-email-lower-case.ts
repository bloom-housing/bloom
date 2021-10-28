import { MigrationInterface, QueryRunner } from "typeorm"

export class userEmailLowerCase1633557587028 implements MigrationInterface {
  name = "userEmailLowerCase1633557587028"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "user_accounts" SET email = lower(email);
      UPDATE household_member SET email_address = lower(email_address);
      UPDATE listings SET leasing_agent_email = lower(leasing_agent_email);
      UPDATE applicant SET email_address = lower(email_address);
      UPDATE alternate_contact SET email_address = lower(email_address);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "user_accounts" SET email = lower(email);
      UPDATE household_member SET email_address = lower(email_address);
      UPDATE listings SET leasing_agent_email = lower(leasing_agent_email);
      UPDATE applicant SET email_address = lower(email_address);
      UPDATE alternate_contact SET email_address = lower(email_address);
    `)
  }
}
