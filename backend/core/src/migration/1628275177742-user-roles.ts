import {MigrationInterface, QueryRunner} from "typeorm";

// export class userRoles1628275177742 implements MigrationInterface {
//     name = 'userRoles1628275177742'

//     public async up(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`CREATE TABLE "user_roles" ("is_admin" boolean NOT NULL DEFAULT false, "is_partner" boolean NOT NULL DEFAULT false, "user_id" uuid NOT NULL, CONSTRAINT "REL_87b8888186ca9769c960e92687" UNIQUE ("user_id"), CONSTRAINT "PK_87b8888186ca9769c960e926870" PRIMARY KEY ("user_id"))`);
//         await queryRunner.query(`UPDATE roles SET roles.isAdmin = users.isAdmin from "user_roles" roles INNER JOIN "user_accounts" users ON roles.user_id = users.id`)
//         await queryRunner.query(`ALTER TABLE "user_accounts" DROP COLUMN "is_admin"`);
//         await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user_accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
//     }

//     public async down(queryRunner: QueryRunner): Promise<void> {
//         await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
//         await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" DROP DEFAULT`);
//         await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "status" DROP NOT NULL`);
//         await queryRunner.query(`ALTER TABLE "user_accounts" ADD "is_admin" boolean NOT NULL DEFAULT false`);
//         await queryRunner.query(`DROP TABLE "user_roles"`);
//     }

// }
