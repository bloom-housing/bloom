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

  const enableResources = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableResources)

  const enableCustomListingNotifications = isFeatureFlagOn(
    props.jurisdiction,
    FeatureFlagEnum.enableCustomListingNotifications
  )

  const showNotificationsCard =
    enableCustomListingNotifications ||
    (props.jurisdiction && props.jurisdiction.notificationsSignUpUrl)

  const enableFAQCard = isFeatureFlagOn(props.jurisdiction, FeatureFlagEnum.enableFaqResourceCard)

  const cardCount = [
    showNotificationsCard,
    enableResources,
    enableAdditionalResources,
    enableFAQCard,
  ].filter(Boolean).length

  return (
    <Grid spacing="lg">
      <Grid.Row columns={cardCount > 2 ? cardCount : 2}>
        {showNotificationsCard && (
          <Grid.Cell>
            <BloomCard
              iconSymbol={"envelope"}
              title={t("welcome.signUp")}
              variant={"block"}
              headingPriority={3}
              className={styles["resource"]}
              iconClass={"card-icon"}
            >
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
            </BloomCard>
          </Grid.Cell>
        )}
        {enableFAQCard && (
          <Grid.Cell>
            <BloomCard
              iconSymbol="questionMarkCircle"
              title={t("welcome.faq")}
              subtitle={tIfExists("welcome.faqSubtitle")}
              variant={"block"}
              headingPriority={3}
              className={styles["resource"]}
              iconClass={"card-icon"}
            >
              <Card.Section>
                <Button key={"faq"} href="/faq" variant="primary-outlined" size={"sm"}>
                  {t("welcome.learnMore")}
                </Button>
              </Card.Section>
            </BloomCard>
          </Grid.Cell>
        )}
        {enableResources && (
          <Grid.Cell>
            <BloomCard
              iconSymbol="house"
              title={t("welcome.seeMoreOpportunitiesTruncated")}
              variant={"block"}
              headingPriority={3}
              className={styles["resource"]}
              iconClass={"card-icon"}
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
        )}
        {enableAdditionalResources && (
          <Grid.Cell>
            <BloomCard
              iconSymbol="questionMarkCircle"
              title={t("resources.additionalResourcesTitle")}
              variant={"block"}
              headingPriority={3}
              className={styles["resource"]}
              iconClass={styles["resource-icon"]}
            >
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
            </BloomCard>
          </Grid.Cell>
        )}
      </Grid.Row>
    </Grid>
  )
}
