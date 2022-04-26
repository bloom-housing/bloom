import { MigrationInterface, QueryRunner } from "typeorm"
import { Region } from "../property/types/region-enum"

export interface Neighborhood {
  name: string
  region: Region
}

export class addPropertyRegion1649062179928 implements MigrationInterface {
  name = "addPropertyRegion1649062179928"

  // NOTE: imported from https://github.com/CityOfDetroit/bloom/blob/main/ui-components/src/helpers/regionNeighborhoodMap.ts
  //  Issue comment: https://github.com/CityOfDetroit/bloom/issues/1015#issuecomment-1068056607
  neighborhoods: Neighborhood[] = [
    { name: "Airport Sub area", region: Region.Eastside },
    { name: "Barton McFarland area", region: Region.Westside },
    { name: "Boston-Edison/North End area", region: Region.Westside },
    { name: "Boynton", region: Region.Southwest },
    { name: "Campau/Banglatown", region: Region.Eastside },
    { name: "Dexter Linwood", region: Region.Westside },
    { name: "Farwell area", region: Region.Eastside },
    { name: "Gratiot Town/Kettering area", region: Region.Eastside },
    { name: "Gratiot/7 Mile area", region: Region.Eastside },
    { name: "Greater Corktown area", region: Region.Downtown },
    { name: "Greater Downtown area", region: Region.Downtown },
    { name: "Greater Downtown area", region: Region.Downtown },
    { name: "Islandview/Greater Villages area", region: Region.Eastside },
    { name: "Islandview/Greater Villages area", region: Region.Eastside },
    { name: "Islandview/Greater Villages area", region: Region.Westside },
    { name: "Jefferson Chalmers area", region: Region.Eastside },
    { name: "Livernois/McNichols area", region: Region.Westside },
    { name: "Livernois/McNichols area", region: Region.Westside },
    { name: "Morningside area", region: Region.Eastside },
    { name: "North Campau area", region: Region.Eastside },
    { name: "Northwest Grand River area", region: Region.Westside },
    { name: "Northwest University District area", region: Region.Westside },
    { name: "Palmer Park area", region: Region.Westside },
    { name: "Russell Woods/Nardin Park area", region: Region.Westside },
    { name: "Southwest/Vernor area", region: Region.Southwest },
    { name: "Southwest/Vernor area", region: Region.Southwest },
    { name: "Warrendale/Cody Rouge", region: Region.Westside },
    { name: "West End area", region: Region.Eastside },
  ]

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "property_region_enum" AS ENUM('Downtown', 'Eastside', 'Midtown - New Center', 'Southwest', 'Westside')`
    )
    await queryRunner.query(`ALTER TABLE "property" ADD "region" "property_region_enum"`)

    let properties: Array<{ id: string; neighborhood?: string }> = await queryRunner.query(
      `SELECT id, neighborhood FROM property`
    )

    for (let p of properties) {
      const neighborhood = this.neighborhoods.find(
        (neighborhood) => neighborhood.name === p.neighborhood
      )
      if (!neighborhood) {
        console.warn(`neighborhood ${p.neighborhood} not found in neighborhood:region map`)
        continue
      }
      await queryRunner.query(`UPDATE property SET region = $1 WHERE id = $2`, [
        neighborhood.region,
        p.id,
      ])
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "region"`)
    await queryRunner.query(`DROP TYPE "property_region_enum"`)
  }
}
