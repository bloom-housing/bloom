import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { Hero } from "../../patterns/Hero"

export const Content404 = () => {
  return (
    <Hero
      title={t("errors.notFound.title")}
      subtitle={"Sorry, we couldn't find the page you're looking for."}
      note={"404"}
      action={
        <Button variant="primary-outlined" href="/">
          {"Back to home"}
        </Button>
      }
    />
  )
}
