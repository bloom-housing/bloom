import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { Hero } from "../../patterns/Hero"

export const Content404 = () => {
  return (
    <Hero
      title={t("errors.notFound.title")}
      subtitle={t("errors.notFound.subtitle")}
      note={"404"}
      action={
        <Button variant="primary-outlined" href="/">
          {t("errors.backToHome")}
        </Button>
      }
    />
  )
}
