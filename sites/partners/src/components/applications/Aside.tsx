import React, { useContext, useMemo, useState } from "react"
import dayjs from "dayjs"
import {
  t,
  Button,
  GridCell,
  AppearanceStyleType,
  StatusMessages,
  LocalizedLink,
  Modal,
  LinkButton,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
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
      <GridCell className="flex" key="btn-cancel">
        <LinkButton
          unstyled
          fullWidth
          className="bg-opacity-0 text-blue-900"
          href={`/listings/${listingId}/applications`}
        >
          {t("t.cancel")}
        </LinkButton>
      </GridCell>
    )

    if (type === "details") {
      elements.push(
        <GridCell key="btn-submitNew">
          <LocalizedLink href={`/application/${applicationId}/edit`}>
            <Button styleType={AppearanceStyleType.secondary} fullWidth onClick={() => false}>
              {t("t.edit")}
            </Button>
          </LocalizedLink>
        </GridCell>,
        <GridCell className="flex" key="btn-cancel">
          <Button
            unstyled
            fullWidth
            className="bg-opacity-0 text-red-750"
            onClick={() => setDeleteModal(true)}
          >
            {t("t.delete")}
          </Button>
        </GridCell>
      )
    }

    if (type === "add" || type === "edit") {
      elements.push(
        <GridCell key="btn-submit">
          <Button
            styleType={AppearanceStyleType.primary}
            fullWidth
            onClick={() => false}
            dataTestId={"submitApplicationButton"}
          >
            {type === "edit" ? t("application.add.saveAndExit") : t("t.submit")}
          </Button>
        </GridCell>
      )

      if (type === "add") {
        elements.push(
          <GridCell key="btn-submitNew">
            <Button
              type="button"
              styleType={AppearanceStyleType.secondary}
              fullWidth
              onClick={() => triggerSubmitAndRedirect()}
            >
              {t("t.submitNew")}
            </Button>
          </GridCell>,
          cancel
        )
      }

      if (type === "edit") {
        elements.push(
          <div className="flex justify-center" key="btn-group">
            {cancel}
            <GridCell className="flex" key="btn-delete">
              <Button
                type="button"
                unstyled
                fullWidth
                className="bg-opacity-0 text-alert"
                onClick={() => setDeleteModal(true)}
              >
                {t("t.delete")}
              </Button>
            </GridCell>
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
            styleType={AppearanceStyleType.alert}
            onClick={() => {
              onDelete()
              setDeleteModal(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.delete")}
          </Button>,
          <Button
            onClick={() => {
              setDeleteModal(false)
            }}
            size={AppearanceSizeType.small}
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
