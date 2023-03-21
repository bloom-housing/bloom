import { MigrationInterface, QueryRunner } from "typeorm"

export class temp1679415494280 implements MigrationInterface {
  name = "temp1679415494280"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_beb1c8e9f64f578908135aa6899"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_917522015bb101f06f1ba84c54e" PRIMARY KEY ("listing_id", "image_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_42d86daebffadee893f602506c2"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_676e34fca76b3f1ae692b0c0a50" PRIMARY KEY ("listing_id", "multiselect_question_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_94041359df3c1b14c4420808d16"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_917522015bb101f06f1ba84c54e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_1894cf77497e73fcc3fc70371ff" PRIMARY KEY ("image_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_1894cf77497e73fcc3fc70371ff"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_2abb5c9d795f27dbc4b10ced9dc" PRIMARY KEY ("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_676e34fca76b3f1ae692b0c0a50"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_4adc638f87b18301e5d73bfb2e2" PRIMARY KEY ("multiselect_question_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_4adc638f87b18301e5d73bfb2e2"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_2ceddbd7c705edaf32f00642ce7" PRIMARY KEY ("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "multiselect_question_id" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "FK_d123697625fe564c2bae54dcecf"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "FK_94041359df3c1b14c4420808d16"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "multiselect_question_id" SET DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_2ceddbd7c705edaf32f00642ce7"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_4adc638f87b18301e5d73bfb2e2" PRIMARY KEY ("multiselect_question_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "multiselect_question_id" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_4adc638f87b18301e5d73bfb2e2"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_676e34fca76b3f1ae692b0c0a50" PRIMARY KEY ("listing_id", "multiselect_question_id", "id")`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ALTER COLUMN "listing_id" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_92adcb35f2f14e316b4cb12a84e" FOREIGN KEY ("multiselect_question_id") REFERENCES "multiselect_questions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "FK_d123697625fe564c2bae54dcecf" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_2abb5c9d795f27dbc4b10ced9dc"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_1894cf77497e73fcc3fc70371ff" PRIMARY KEY ("image_id", "id")`
    )
    await queryRunner.query(`ALTER TABLE "listing_images" ALTER COLUMN "image_id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_1894cf77497e73fcc3fc70371ff"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_917522015bb101f06f1ba84c54e" PRIMARY KEY ("listing_id", "image_id", "id")`
    )
    await queryRunner.query(`ALTER TABLE "listing_images" ALTER COLUMN "listing_id" SET NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_6fc0fefe11fb46d5ee863ed483a" FOREIGN KEY ("image_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" DROP COLUMN "created_at"`)
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" DROP CONSTRAINT "PK_676e34fca76b3f1ae692b0c0a50"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_multiselect_questions" ADD CONSTRAINT "PK_42d86daebffadee893f602506c2" PRIMARY KEY ("listing_id", "multiselect_question_id")`
    )
    await queryRunner.query(`ALTER TABLE "listing_multiselect_questions" DROP COLUMN "id"`)
    await queryRunner.query(`ALTER TABLE "listing_images" DROP COLUMN "updated_at"`)
    await queryRunner.query(`ALTER TABLE "listing_images" DROP COLUMN "created_at"`)
    await queryRunner.query(
      `ALTER TABLE "listing_images" DROP CONSTRAINT "PK_917522015bb101f06f1ba84c54e"`
    )
    await queryRunner.query(
      `ALTER TABLE "listing_images" ADD CONSTRAINT "PK_beb1c8e9f64f578908135aa6899" PRIMARY KEY ("listing_id", "image_id")`
    )
    await queryRunner.query(`ALTER TABLE "listing_images" DROP COLUMN "id"`)
  }
}
