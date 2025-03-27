import { ClickableCard } from "@bloom-housing/shared-helpers"
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { GridCell } from "@bloom-housing/ui-components"
import { Grid, Heading } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import styles from "./HomeRegions.module.scss"

export const regionImageUrls: Map<RegionEnum, string> = new Map([
  [
    RegionEnum.Greater_Downtown,
    "https://pbs.twimg.com/media/DSzZwQKVAAASkw_?format=jpg&name=large",
  ],
  [
    RegionEnum.Eastside,
    "https://res.cloudinary.com/exygy/image/upload/v1740007497/detroit/Detroit-Eastside_qzxx6n.jpg",
  ],
  [
    RegionEnum.Southwest,
    "https://res.cloudinary.com/exygy/image/upload/v1740007258/detroit/Detroit-Southwest_wbx3nu.jpg",
  ],
  [
    RegionEnum.Westside,
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Atkinson_avenue_historic_district.JPG/1920px-Atkinson_avenue_historic_district.JPG",
  ],
])

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
                <img src={regionImageUrls.get(region.enum)} alt={region.title} />
              </div>
              <Heading priority={5} size="lg" className={styles["region-card-name"]}>
                {region.title}
              </Heading>
            </ClickableCard>
          </GridCell>
        ))}
      </GridRow>
    </Grid>
  )
}
