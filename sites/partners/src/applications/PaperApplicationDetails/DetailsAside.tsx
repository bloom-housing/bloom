import React, { useContext, useMemo, useState } from "react"
import moment from "moment"
import {
  t,
  StatusAside,
  Button,
  GridCell,
  AppearanceStyleType,
  StatusMessages,
  LocalizedLink,
  Modal,
  AppearanceBorderType,
} from "@bloom-housing/ui-components"
import { DetailsApplicationContext } from "./DetailsApplicationContext"

type DetailsAsideProps = {
  applicationId: string
  onDelete: () => void
}

const DetailsAside = ({ applicationId, onDelete }: DetailsAsideProps) => {
  const application = useContext(DetailsApplicationContext)

  const [deleteModal, setDeleteModal] = useState(false)

  const applicationUpdated = useMemo(() => {
    if (!application) return null

    const momentDate = moment(application.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [application])

  return (
    <>
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
              onClick={() => setDeleteModal(true)}
            >
              {t("t.delete")}
            </Button>
          </GridCell>,
        ]}
      >
        <StatusMessages lastTimestamp={applicationUpdated} />
      </StatusAside>

      <Modal
        open={!!deleteModal}
        title={t("application.deleteThisApplication")}
        ariaDescription={t("application.deleteApplicationDescription")}
        onClose={() => setDeleteModal(false)}
        actions={[
          <Button
            styleType={AppearanceStyleType.alert}
            onClick={() => {
              onDelete()
              setDeleteModal(false)
            }}
          >
            {t("t.delete")}
          </Button>,
          <Button
            styleType={AppearanceStyleType.primary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setDeleteModal(false)
            }}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("application.deleteApplicationDescription")}
      </Modal>
    </>
  )
}

export { DetailsAside as default, DetailsAside }
