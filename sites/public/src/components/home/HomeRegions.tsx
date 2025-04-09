import { ClickableCard } from "@bloom-housing/shared-helpers"
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { GridCell } from "@bloom-housing/ui-components"
import { Grid, Link } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import styles from "./HomeRegions.module.scss"

// Update images per jurisdiction
// export const regionImageUrls: Map<RegionEnum, string> = new Map([
//   [
//     RegionEnum.Greater_Downtown,
//     "url",
//   ],
//   [RegionEnum.Eastside, "url"],
//   [RegionEnum.Southwest, "url"],
//   [RegionEnum.Westside, "url"],
// ])

export const HomeRegions = () => {
  const availableRegions = Object.values(RegionEnum).map((region) => ({
    title: region.replace("_", " "),
    enum: region,
  }))

  return (
    <Grid>
      <GridRow columns={4}>
        {availableRegions.map((region) => (
          <GridCell className={styles["region-entry"]} key={region.enum}>
            <ClickableCard className={styles["region-card"]}>
              <div className={styles["region-card-image"]}>
                <img src={"/images/listing-fallback.png"} alt={region.title} />
              </div>
              <Link href={"/listings"}>
                <div className={styles["region-card-name"]}>{region.title}</div>
              </Link>
            </ClickableCard>
          </GridCell>
        ))}
      </GridRow>
    </Grid>
  )
}
