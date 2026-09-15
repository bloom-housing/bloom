import { BloomCard, tIfExists } from "@bloom-housing/shared-helpers"
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

  const enableCustomListingNotifications = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableCustomListingNotifications
  )

  const enableGetAssistanceCard = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableGetAssistanceCard
  )

  const enableResourcesCard = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableResourcesCard
  )

  const enableSeeOurData = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableSeeOurData)

  const showNotificationsCard =
    enableCustomListingNotifications ||
    (props.jurisdiction && props.jurisdiction.notificationsSignUpUrl)

  const enabled = []

  if (enableAdditionalResources) {
    enabled.push(enableAdditionalResources)
  }
  if (enableGetAssistanceCard) {
    enabled.push(enableGetAssistanceCard)
  }
  if (enableResourcesCard) {
    enabled.push(enableResourcesCard)
  }
  if (enableSeeOurData) {
    enabled.push(enableSeeOurData)
  }
  if (showNotificationsCard) {
    enabled.push(showNotificationsCard)
  }

  const additionalResourcesCard = (
    <Grid.Cell>
      <BloomCard
        iconSymbol="questionMarkCircle"
        title={t("resources.additionalResourcesTitle")}
        variant={"block"}
        headingPriority={3}
        className={styles["resource"]}
        iconClass={styles["resource-icon"]}
      >
        <>
          {tIfExists("resources.additionalResourcesText") && (
            <Card.Section className={styles["resource-text"]}>
              {t("resources.additionalResourcesText")}
            </Card.Section>
          )}
          <Card.Section>
            <Button
              key={"learn-more"}
              href={t("resources.additionalResourcesLink")}
              variant="primary-outlined"
              size={"sm"}
            >
              {t("welcome.learnMore")}
            </Button>
          </Card.Section>
        </>
      </BloomCard>
    </Grid.Cell>
  )

  const getAssistanceCard = (
    <Grid.Cell>
      <BloomCard
        iconSymbol="questionMarkCircle"
        title={t("welcome.getAssistanceTitle")}
        variant={"block"}
        headingPriority={3}
        className={styles["resource"]}
        iconClass={styles["resource-icon"]}
      >
        <>
          {tIfExists("welcome.getAssistanceText") && (
            <Card.Section className={styles["resource-text"]}>
              {t("welcome.getAssistanceText")}
            </Card.Section>
          )}
          <Card.Section>
            <Button
              key={"get-assistance"}
              href="/get-assistance"
              variant="primary-outlined"
              size={"sm"}
            >
              {t("welcome.getAssistanceButton")}
            </Button>
          </Card.Section>
        </>
      </BloomCard>
    </Grid.Cell>
  )

  const notificationsCard = (
    <Grid.Cell>
      <BloomCard
        iconSymbol={"envelope"}
        title={t("welcome.signUp")}
        variant={"block"}
        headingPriority={3}
        className={styles["resource"]}
        iconClass={"card-icon"}
      >
        <>
          {tIfExists("welcome.signUpText") && (
            <Card.Section className={styles["resource-text"]}>
              {t("welcome.signUpText")}
            </Card.Section>
          )}
          <Card.Section>
            <Button
              key={"sign-up"}
              href={
                enableCustomListingNotifications
                  ? "/account/notifications"
                  : props.jurisdiction.notificationsSignUpUrl
              }
              variant="primary-outlined"
              size={"sm"}
            >
              {t("welcome.signUpToday")}
            </Button>
          </Card.Section>
        </>
      </BloomCard>
    </Grid.Cell>
  )

  const resourcesCard = (
    <Grid.Cell>
      <BloomCard
        iconSymbol="house"
        title={t("welcome.seeMoreOpportunitiesTruncated")}
        variant={"block"}
        headingPriority={3}
        className={styles["resource"]}
        iconClass={"card-icon"}
      >
        <>
          {tIfExists("welcome.viewAdditionalHousingText") && (
            <Card.Section className={styles["resource-text"]}>
              {t("welcome.viewAdditionalHousingText")}
            </Card.Section>
          )}
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
        </>
      </BloomCard>
    </Grid.Cell>
  )

  const seeOurDataCard = (
    <Grid.Cell>
      <BloomCard
        iconSymbol="chartBar"
        title={t("welcome.seeOurDataTitle")}
        variant={"block"}
        headingPriority={3}
        className={styles["resource"]}
        iconClass={styles["resource-icon"]}
      >
        <>
          {tIfExists("welcome.seeOurDataText") && (
            <Card.Section className={styles["resource-text"]}>
              {t("welcome.seeOurDataText")}
            </Card.Section>
          )}
          <Card.Section>
            <Button
              key={"see-our-data"}
              href={t("welcome.seeOurDataLink")}
              variant="primary-outlined"
              size={"sm"}
            >
              {t("welcome.seeOurDataButton")}
            </Button>
          </Card.Section>
        </>
      </BloomCard>
    </Grid.Cell>
  )

  const cards = (
    <>
      {enableGetAssistanceCard && getAssistanceCard}
      {showNotificationsCard && notificationsCard}
      {enableAdditionalResources && additionalResourcesCard}
      {enableResourcesCard && resourcesCard}
      {enableSeeOurData && seeOurDataCard}
    </>
  )

  let gridLayout = <></>

  if (enabled.length === 1) {
    gridLayout = (
      <Grid spacing="lg">
        <Grid.Row columns={1}>{cards}</Grid.Row>
      </Grid>
    )
  } else if (enabled.length % 2 === 0) {
    gridLayout = (
      <Grid spacing="lg">
        <Grid.Row columns={2}>{cards}</Grid.Row>
      </Grid>
    )
  } else if (enabled.length > 0) {
    gridLayout = (
      <Grid spacing="lg">
        <Grid.Row columns={3}>{cards}</Grid.Row>
      </Grid>
    )
  }
  return gridLayout
}
