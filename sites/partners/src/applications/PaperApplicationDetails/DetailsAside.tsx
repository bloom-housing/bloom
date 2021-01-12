import React, { useContext, useMemo } from "react"
import moment from "moment"
import {
  t,
  StatusAside,
  Button,
  GridCell,
  AppearanceStyleType,
  StatusMessages,
  LocalizedLink,
} from "@bloom-housing/ui-components"
import { DetailsApplicationContext } from "./DetailsApplicationContext"

type DetailsAsideProps = {
  applicationId: string
}

const DetailsAside = ({ applicationId }: DetailsAsideProps) => {
  const application = useContext(DetailsApplicationContext)

  const applicationUpdated = useMemo(() => {
    if (!application) return null

    const momentDate = moment(application.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [application])

  return (
    <StatusAside
      columns={1}
      actions={[
        <GridCell key="btn-submitNew">
          <LocalizedLink href={`/applications/${applicationId}/edit`}>
            <Button styleType={AppearanceStyleType.secondary} fullWidth onClick={() => false}>
              {t("t.edit")}
            </Button>
          </LocalizedLink>
        </GridCell>,
        <GridCell className="flex" key="btn-cancel">
          <Button
            unstyled
            fullWidth
            className="bg-opacity-0 text-red-700"
            onClick={() => console.log("delete")}
          >
            {t("t.delete")}
          </Button>
        </GridCell>,
      ]}
    >
      <StatusMessages lastTimestamp={applicationUpdated} />
    </StatusAside>
  )
}

export { DetailsAside as default, DetailsAside }
