import React from "react"
import { Card, Button, Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import styles from "./ApplicationCards.module.scss"

const ApplicationCard = (props: { children: React.ReactElement; heading: string }) => {
  return (
    <Card spacing={"sm"} className={`${styles["application-card"]} my-6`}>
      <Card.Section className={`${styles["heading-section"]} px-8 py-4`}>
        <Heading priority={1} size={"xl"} className={styles["card-header"]}>
          {props.heading}
        </Heading>
      </Card.Section>
      <Card.Section className={"px-8"}>{props.children}</Card.Section>
    </Card>
  )
}
export const ApplicationError = (props: { error: string }) => {
  return (
    <ApplicationCard heading={t("account.application.error")}>
      <>
        <p className="mb-5">{props.error}</p>
        <Button size="sm" variant="primary-outlined" href={"/account/applications"}>
          {t("account.application.return")}
        </Button>
      </>
    </ApplicationCard>
  )
}

export const ApplicationListingCard = (props: { listingName: string; listingId: string }) => {
  return (
    <ApplicationCard heading={props.listingName}>
      <div>
        {props.listingId && (
          <Button size="sm" variant={"text"} href={`/listing/${props.listingId}`}>
            {t("application.confirmation.viewOriginalListing")}
          </Button>
        )}
      </div>
    </ApplicationCard>
  )
}
