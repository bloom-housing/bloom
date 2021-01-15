import React, { useContext, useMemo } from "react"
import moment from "moment"
import {
  t,
  StatusAside,
  Button,
  GridCell,
  AppearanceStyleType,
  LinkButton,
  StatusMessages,
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
          <Button
            styleType={AppearanceStyleType.secondary}
            fullWidth
            onClick={() => {
              //
            }}
          >
            {t("t.edit")}
          </Button>
        </GridCell>,
        <GridCell className="flex" key="btn-cancel">
          <LinkButton
            unstyled
            fullWidth
            className="bg-opacity-0 text-red-700"
            href={`/applications/${applicationId}/edit`}
          >
            {t("t.delete")}
          </LinkButton>
        </GridCell>,
      ]}
    >
      <StatusMessages lastTimestamp={applicationUpdated} />
    </StatusAside>
  )
}

export { DetailsAside as default, DetailsAside }
