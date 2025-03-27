import { ClickableCard } from "@bloom-housing/shared-helpers"
import { RegionEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { GridCell } from "@bloom-housing/ui-components"
import { Grid, Heading } from "@bloom-housing/ui-seeds"
import { GridRow } from "@bloom-housing/ui-seeds/src/layout/Grid"
import styles from "./HomeRegions.module.scss"

export const HomeRegions = () => {
  const availableRegions = Object.values(RegionEnum).map((region) => region.replace("_", " "))

  return (
    <Grid>
      <GridRow columns={4}>
        {availableRegions.map((region) => (
          <GridCell key={region}>
            <ClickableCard className={styles["region-card"]}>
              <div className="" role="img" />
              <Heading priority={5} size="lg" className={styles["region-card-name"]}>
                {region}
              </Heading>
            </ClickableCard>
          </GridCell>
        ))}
      </GridRow>
    </Grid>
  )
}
