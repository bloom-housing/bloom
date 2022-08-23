import { MigrationInterface, QueryRunner } from "typeorm"

export class removePropertyRelation1655821661726 implements MigrationInterface {
  name = "removePropertyRelation1655821661726"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_f221e6d7bfd686266003b982b5f"`)
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075"`
    )

    await queryRunner.query(`ALTER TABLE "listings" ADD "accessibility" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "amenities" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "building_total_units" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "developer" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_max" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "household_size_min" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "neighborhood" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "pet_policy" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "smoking_policy" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "units_available" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "unit_amenities" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "services_offered" text`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "year_built" integer`)
    await queryRunner.query(`ALTER TABLE "listings" ADD "building_address_id" uuid`)

    await queryRunner.query(`
      UPDATE listings l
      SET 
        accessibility = property.accessibility, 
        amenities = property.amenities,
        building_total_units = property.building_total_units,
        developer = property.developer,
        household_size_max = property.household_size_max,
        household_size_min = property.household_size_min,
        neighborhood = property.neighborhood,
        pet_policy = property.pet_policy,
        smoking_policy = property.smoking_policy,
        units_available = property.units_available,
        unit_amenities = property.unit_amenities,
        services_offered = property.services_offered,
        year_built = property.year_built,
        building_address_id = property.building_address_id
      FROM property 
      WHERE l.property_id = property.id
    `)

    await queryRunner.query(`ALTER TABLE "units" ADD COLUMN "listing_id" uuid`)

    const listings: [{ id: string; property_id: string }] = await queryRunner.query(
      `SELECT id, property_id FROM LISTINGS`
    )
    for (const l of listings) {
      await queryRunner.query(`UPDATE units SET listing_id = ($1) WHERE property_id = ($2)`, [
        l.id,
        l.property_id,
      ])
    }

    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "property_id"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "property_id"`)
    await queryRunner.query(`DROP TABLE "property_group_properties_property"`)
    await queryRunner.query(
      `ALTER TABLE "property" DROP CONSTRAINT "UQ_f0f7062f34738e0b338163786fd"`
    )
    await queryRunner.query(`DROP TABLE "property"`)

    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905" FOREIGN KEY ("building_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "listings" DROP CONSTRAINT "FK_e5d5291cd6ab92cbec304aab905"`
    )
    await queryRunner.query(`ALTER TABLE "units" DROP CONSTRAINT "FK_9aebcde52d6e054e5ac5d26228c"`)

    await queryRunner.query(`CREATE TABLE "property"`)
    await queryRunner.query(`ALTER TABLE "property" ADD "accessibility" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "amenities" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "building_total_units" integer`)
    await queryRunner.query(`ALTER TABLE "property" ADD "developer" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "household_size_max" integer`)
    await queryRunner.query(`ALTER TABLE "property" ADD "household_size_min" integer`)
    await queryRunner.query(`ALTER TABLE "property" ADD "neighborhood" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "pet_policy" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "smoking_policy" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "units_available" integer`)
    await queryRunner.query(`ALTER TABLE "property" ADD "unit_amenities" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "services_offered" text`)
    await queryRunner.query(`ALTER TABLE "property" ADD "year_built" integer`)
    await queryRunner.query(`ALTER TABLE "property" ADD "building_address_id" uuid`)

    await queryRunner.query(`ALTER TABLE "units" ADD COLUMN "property_id" uuid`)
    await queryRunner.query(`ALTER TABLE "listings" ADD COLUMN "property_id" uuid`)

    const listings = await queryRunner.query(`SELECT * FROM listings`)

    for (const l of listings) {
      const [newProperty] = await queryRunner.query(
        `INSERT INTO "property" (accessibility, amenities, 
                building_total_units, developer, household_size_max, household_size_min, 
                neighborhood, pet_policy, smoking_policy, units_available, unit_amenities, 
                services_offered, year_built, building_address_id) 
                VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
                RETURNING id`,
        [
          l.accessibility,
          l.amenities,
          l.building_total_units,
          l.developer,
          l.household_size_max,
          l.household_size_min,
          l.neighborhood,
          l.pet_policy,
          l.smoking_policy,
          l.units_available,
          l.unit_amenities,
          l.services_offered,
          l.year_built,
          l.building_address_id,
        ]
      )
      await queryRunner.query(`UPDATE listings SET property_id = ($1) WHERE id = ($2)`, [
        newProperty.id,
        l.id,
      ])
      await queryRunner.query(`UPDATE units SET property_id = ($1) WHERE listing_id = ($2)`, [
        newProperty.id,
        l.id,
      ])
    }

    await queryRunner.query(`ALTER TABLE "units" ALTER COLUMN "property_id" SET NOT NULL`)
    await queryRunner.query(`ALTER TABLE "listings" ALTER COLUMN "property_id" SET NOT NULL`)

    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_address_id"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "year_built"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "services_offered"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "unit_amenities"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "units_available"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "smoking_policy"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "pet_policy"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "neighborhood"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_min"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "household_size_max"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "developer"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "building_total_units"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "amenities"`)
    await queryRunner.query(`ALTER TABLE "listings" DROP COLUMN "accessibility"`)

    await queryRunner.query(`ALTER TABLE "units" DROP COLUMN "listing_id"`)

    await queryRunner.query(
      `ALTER TABLE "listings" ADD CONSTRAINT "FK_9eef913a9013d6e3d09a92ec075" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "units" ADD CONSTRAINT "FK_f221e6d7bfd686266003b982b5f" FOREIGN KEY ("property_id") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    )
  }
}
