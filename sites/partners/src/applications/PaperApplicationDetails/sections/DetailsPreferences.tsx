import React, { useContext } from "react"
import { t, GridSection, ViewItem, GridCell } from "@bloom-housing/ui-components"
import { ApplicationContext } from "../../ApplicationContext"

const DetailsPreferences = () => {
  const application = useContext(ApplicationContext)

  return (
    <GridSection className="bg-primary-lighter" title={t("application.details.preferences")} inset>
      <GridCell>
        <ViewItem
          label={`${t("application.details.liveOrWorkIn")} ${t("application.details.countyName")}`}
        >
          {(() => {
            if (
              !application.preferences.liveIn &&
              !application.preferences.workIn &&
              !application.preferences.none
            ) {
              return t("t.n/a")
            }

            return application.preferences.liveIn || application.preferences.workIn
              ? t("t.yes")
              : t("t.no")
          })()}
        </ViewItem>
      </GridCell>
    </GridSection>
  )
}

export { DetailsPreferences as default, DetailsPreferences }
