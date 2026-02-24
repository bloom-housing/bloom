import React from "react"
import { useRouter } from "next/router"
import { Button } from "@bloom-housing/ui-seeds"
import { t } from "@bloom-housing/ui-components"
import Card from "@bloom-housing/ui-seeds/src/blocks/Card"
import { BloomCard } from "@bloom-housing/shared-helpers"
import FormsLayout from "../layouts/forms"
import styles from "../../styles/create-account.module.scss"

const CreateAdvocateAccountConfirmation = () => {
  const router = useRouter()

  return (
    <FormsLayout pageTitle={t("authentication.requestAdvocateAccount.confirmationPageTitle")}>
      <BloomCard
        title={t("authentication.requestAdvocateAccount.confirmationTitle")}
        iconSymbol={"userCircle"}
        iconClass={"card-icon"}
        headingClass={"seeds-large-heading"}
      >
        <>
          <Card.Section className={"seeds-m-be-8"}>
            {t("authentication.requestAdvocateAccount.confirmation")}
          </Card.Section>
          <Card.Section className={styles["footer-card-section"]}>
            <Button variant="primary" onClick={() => router.push("/")}>
              {t("t.ok")}
            </Button>
          </Card.Section>
        </>
      </BloomCard>
    </FormsLayout>
  )
}

export { CreateAdvocateAccountConfirmation as default, CreateAdvocateAccountConfirmation }
