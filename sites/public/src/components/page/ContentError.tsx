import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { Hero } from "../../patterns/Hero"

export const ContentError = () => {
  return (
    <Hero
      title={t("errors.somethingWentWrong")}
      subtitle={t("authentication.signIn.errorGenericMessage")}
      note={"500"}
      action={
        <Button variant="primary-outlined" href="/">
          {t("errors.backToHome")}
        </Button>
      }
    />
  )
}
