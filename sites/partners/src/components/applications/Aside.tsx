import React, { useContext, useMemo, useState } from "react"
import dayjs from "dayjs"
import { t, StatusMessages, Modal } from "@bloom-housing/ui-components"
import { Button, Grid, Link } from "@bloom-housing/ui-seeds"
import { ApplicationContext } from "./ApplicationContext"
import { StatusAside } from "../shared/StatusAside"

type AsideProps = {
  type: AsideType
  listingId: string
  onDelete: () => void
  triggerSubmitAndRedirect?: () => void
}

type AsideType = "add" | "edit" | "details"

const Aside = ({ listingId, type, onDelete, triggerSubmitAndRedirect }: AsideProps) => {
  const application = useContext(ApplicationContext)
  const [deleteModal, setDeleteModal] = useState(false)

  const applicationId = application?.id

  const applicationUpdated = useMemo(() => {
    if (!application) return null

    const dayjsDate = dayjs(application.updatedAt)

    return dayjsDate.format("MMMM DD, YYYY")
  }, [application])

  const actions = useMemo(() => {
    const elements = []

    const cancel = (
      <Grid.Cell className="flex" key="btn-cancel">
        <Link className="w-100" href={`/listings/${listingId}/applications`}>
          {t("t.cancel")}
        </Link>
      </Grid.Cell>
    )

    if (type === "details") {
      elements.push(
        <Grid.Cell key="btn-submitNew">
          <Button href={`/application/${applicationId}/edit`} variant="secondary" className="w-100">
            {t("t.edit")}
          </Button>
        </Grid.Cell>,
        <Grid.Cell className="flex" key="btn-cancel">
          <Button variant="text" className="text-alert w-100" onClick={() => setDeleteModal(true)}>
            {t("t.delete")}
          </Button>
        </Grid.Cell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(
        <Grid.Cell key="btn-submit">
          <Button
            variant="primary"
            className="w-100"
            onClick={() => false}
            id={"submitApplicationButton"}
          >
            {type === "edit" ? t("application.add.saveAndExit") : t("t.submit")}
          </Button>
        </Grid.Cell>
      )

      if (type === "add") {
        elements.push(
          <Grid.Cell key="btn-submitNew">
            <Button
              type="button"
              variant="secondary"
              className="w-100"
              onClick={() => triggerSubmitAndRedirect()}
            >
              {t("t.submitNew")}
            </Button>
          </Grid.Cell>,
          cancel
        )
      }

      if (type === "edit") {
        elements.push(
          <div className="flex justify-center" key="btn-group">
            {cancel}
            <Grid.Cell className="flex" key="btn-delete">
              <Button
                type="button"
                variant="text"
                className="text-alert w-100"
                onClick={() => setDeleteModal(true)}
              >
                {t("t.delete")}
              </Button>
            </Grid.Cell>
          </div>
        )
      }
    }

    return elements
  }, [applicationId, listingId, triggerSubmitAndRedirect, type])

  return (
    <>
      <StatusAside columns={1} actions={actions}>
        {type === "edit" && <StatusMessages lastTimestamp={applicationUpdated} />}
      </StatusAside>

      <Modal
        open={!!deleteModal}
        title={t("application.deleteThisApplication")}
        ariaDescription={t("application.deleteApplicationDescription")}
        onClose={() => setDeleteModal(false)}
        actions={[
          <Button
            variant="alert"
            onClick={() => {
              onDelete()
              setDeleteModal(false)
            }}
            size="sm"
          >
            {t("t.delete")}
          </Button>,
          <Button
            variant="primary-outlined"
            onClick={() => {
              setDeleteModal(false)
            }}
            size="sm"
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

export { Aside as default, Aside }
