import {MigrationInterface, QueryRunner} from "typeorm";

export class convertListingImageToArray1644318717089 implements MigrationInterface {
    name = 'convertListingImageToArray1644318717089'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_ecc271b96bd18df0efe47b85186"`);
        await queryRunner.query(`CREATE TABLE "listings_images_assets" ("listings_id" uuid NOT NULL, "assets_id" uuid NOT NULL, CONSTRAINT "PK_2c24749b58b0121620bec367d16" PRIMARY KEY ("listings_id", "assets_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a60dfc1493637cc3340f20dab3" ON "listings_images_assets" ("listings_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_148a2eba2681f8fd75ba49e0c5" ON "listings_images_assets" ("assets_id") `);
        await queryRunner.query(`ALTER TABLE "listings_images_assets" ADD CONSTRAINT "FK_a60dfc1493637cc3340f20dab35" FOREIGN KEY ("listings_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "listings_images_assets" ADD CONSTRAINT "FK_148a2eba2681f8fd75ba49e0c56" FOREIGN KEY ("assets_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        const listings: [{id, image_id}] = await queryRunner.query(`SELECT id, image_id from listings`);
        for(const l of listings) {
           await queryRunner.query(`INSERT INTO "listings_images_assets" (listings_id, assets_id) VALUES($1, $2)`, [l.id, l.image_id]);
        }
        await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "image_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listings_images_assets" DROP CONSTRAINT "FK_148a2eba2681f8fd75ba49e0c56"`);
        await queryRunner.query(`ALTER TABLE "listings_images_assets" DROP CONSTRAINT "FK_a60dfc1493637cc3340f20dab35"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD "image_id" uuid`);
        await queryRunner.query(`DROP INDEX "IDX_148a2eba2681f8fd75ba49e0c5"`);
        await queryRunner.query(`DROP INDEX "IDX_a60dfc1493637cc3340f20dab3"`);
        await queryRunner.query(`DROP TABLE "listings_images_assets"`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_ecc271b96bd18df0efe47b85186" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
