import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { DetailsApplicationContext } from "../DetailsApplicationContext"

const DetailsPreferences = () => {
  const application = useContext(DetailsApplicationContext)

  return (
    <GridSection className="bg-primary-lighter" title={t("application.details.preferences")} inset>
      <GridCell>
        <ViewItem
          label={`${t("application.details.liveOrWorkIn")} ${t("application.details.countyName")}`}
        >
          {application.preferences.liveIn || application.preferences.workIn
            ? t("t.yes")
            : t("t.no")}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsPreferences as default, DetailsPreferences }
