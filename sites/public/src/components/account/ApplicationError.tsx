import React from "react"
import { Card, Button, Heading } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import styles from "./ApplicationError.module.scss"

export const ApplicationError = (props: { error: string }) => {
  return (
    <Card spacing={"sm"} className={`${styles["application-error"]} my-6`}>
      <Card.Section className={`${styles["heading-section"]} px-8 py-4`}>
        <Heading priority={1} size={"xl"} className={styles["card-header"]}>
          {t("account.application.error")}
        </Heading>
      </Card.Section>
      <Card.Section className={"px-8"}>
        <p className="mb-5">{props.error}</p>
        <Button size="sm" variant="primary-outlined" href={"/account/applications"}>
          {t("account.application.return")}
        </Button>
      </Card.Section>
    </Card>
  )
}
