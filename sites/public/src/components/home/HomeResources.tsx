import { BloomCard } from "@bloom-housing/shared-helpers"
import { Button, Card, Grid } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { isFeatureFlagOn } from "../../lib/helpers"
import styles from "./HomeResources.module.scss"

interface HomeResourcesProps {
  jurisdiction: Jurisdiction
}

export const HomeResources = (props: HomeResourcesProps) => {
  const enableAdditionalResources = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableAdditionalResources
  )

  return (
    <Grid spacing="lg">
      <Grid.Row columns={enableAdditionalResources ? 3 : 2}>
        {props.jurisdiction && props.jurisdiction.notificationsSignUpUrl && (
          <Grid.Cell>
            <BloomCard
              iconSymbol={"envelope"}
              title={t("welcome.signUp")}
              variant={"block"}
              headingPriority={2}
              className={styles["resource"]}
              iconClass={styles["resource-icon"]}
            >
              <Card.Section>
                <Button
                  key={"sign-up"}
                  href={props.jurisdiction.notificationsSignUpUrl}
                  variant="primary-outlined"
                  size={"sm"}
                >
                  {t("welcome.signUpToday")}
                </Button>
              </Card.Section>
            </BloomCard>
          </Grid.Cell>
        )}
        <Grid.Cell>
          <BloomCard
            iconSymbol="house"
            title={t("welcome.seeMoreOpportunitiesTruncated")}
            variant={"block"}
            headingPriority={2}
            className={styles["resource"]}
            iconClass={styles["resource-icon"]}
          >
            <Card.Section>
              <Button
                key={"additional-resources"}
                href="/additional-resources"
                variant="primary-outlined"
                size={"sm"}
              >
                {t("welcome.viewAdditionalHousingTruncated")}
              </Button>
            </Card.Section>
          </BloomCard>
        </Grid.Cell>
        {enableAdditionalResources && (
          <Grid.Cell>
            <BloomCard
              iconSymbol="questionMarkCircle"
              title={t("welcome.learnHousingBasics")}
              variant={"block"}
              headingPriority={2}
              className={styles["resource"]}
              iconClass={styles["resource-icon"]}
            >
              <Card.Section>
                <Button
                  key={"learn-more"}
                  href="/housing-basics"
                  variant="primary-outlined"
                  size={"sm"}
                >
                  {t("welcome.learnMore")}
                </Button>
              </Card.Section>
            </BloomCard>
          </Grid.Cell>
        )}
      </Grid.Row>
    </Grid>
  )
}
