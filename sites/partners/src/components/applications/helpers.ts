import { t } from "@bloom-housing/ui-components"
import { NextRouter } from "next/router"
import { FormTypes } from "../../lib/applications/FormTypes"
import { ApplicationStatusEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const tableColumns = [
  {
    headerName: t("applications.duplicates.duplicateGroup"),
    field: "",
    sortable: false,
    filter: false,
    cellRenderer: "formatLinkCell",
    flex: 1,
    minWidth: 200,
  },
  {
    headerName: t("applications.duplicates.primaryApplicant"),
    field: "",
    sortable: false,
    filter: false,
  },
  {
    headerName: t("t.rule"),
    field: "rule",
    sortable: false,
    filter: false,
  },
  {
    headerName: t("applications.pendingReview"),
    field: "",
    sortable: false,
    filter: false,
    type: "rightAligned",
  },
]

export const getLinkCellFormatter = (router: NextRouter) =>
  class formatLinkCell {
    linkWithId: HTMLSpanElement

    init(params) {
      const applicationId = params.data.id

      this.linkWithId = document.createElement("button")
      this.linkWithId.classList.add("text-blue-700")
      this.linkWithId.innerText = params.value
      this.linkWithId.style.textDecoration = "underline"

      this.linkWithId.addEventListener("click", function () {
        void router.push(`/application/${applicationId}/review`)
      })
    }

    getGui() {
      return this.linkWithId
    }
  }

type ConfirmItem = {
  label: string
  value: string
}

export type AppStatusConfirmSections = {
  changes: ConfirmItem[]
  removals: ConfirmItem[]
}

export const isApplicationWaitlistStatus = (status?: ApplicationStatusEnum) => {
  return (
    status === ApplicationStatusEnum.waitlist || status === ApplicationStatusEnum.waitlistDeclined
  )
}

const normalizeValue = (value?: string | number | null) => {
  if (value === null || value === undefined) return ""
  return value.toString()
}
const hasValue = (value: string) => value !== ""

export const buildAppStatusConfirmSections = (
  data: FormTypes,
  defaultValues: Partial<FormTypes>
): AppStatusConfirmSections => {
  const initialStatus = defaultValues?.application?.status
  const nextStatus = data?.application?.status

  const initialAccessible = normalizeValue(defaultValues?.application?.accessibleUnitWaitlistNumber)
  const nextAccessible = normalizeValue(data?.application?.accessibleUnitWaitlistNumber)

  const initialConventional = normalizeValue(
    defaultValues?.application?.conventionalUnitWaitlistNumber
  )
  const nextConventional = normalizeValue(data?.application?.conventionalUnitWaitlistNumber)

  const changes: ConfirmItem[] = []
  const removals: ConfirmItem[] = []

  const statusChanged = !!nextStatus && nextStatus !== initialStatus
  const initialIsWaitlist = isApplicationWaitlistStatus(initialStatus)
  const nextIsWaitlist = isApplicationWaitlistStatus(nextStatus)

  if (statusChanged) {
    changes.push({
      label: t("application.details.applicationStatus"),
      value: t(`application.details.applicationStatus.${nextStatus}`),
    })
  }

  if (nextIsWaitlist) {
    // editing wait list numbers
    if (nextAccessible !== initialAccessible && hasValue(nextAccessible)) {
      changes.push({
        label: t("application.confirmation.accessibleWaitListLabel"),
        value: nextAccessible,
      })
    }
    if (nextConventional !== initialConventional && hasValue(nextConventional)) {
      changes.push({
        label: t("application.confirmation.conventionalWaitListLabel"),
        value: nextConventional,
      })
    }

    // removing wait list numbers
    if (hasValue(initialAccessible) && !hasValue(nextAccessible)) {
      removals.push({
        label: t("application.confirmation.accessibleWaitListLabel"),
        value: initialAccessible,
      })
    }
    if (hasValue(initialConventional) && !hasValue(nextConventional)) {
      removals.push({
        label: t("application.confirmation.conventionalWaitListLabel"),
        value: initialConventional,
      })
    }
  } else if (statusChanged && initialIsWaitlist) {
    const accessibleRemovalValue = hasValue(nextAccessible) ? nextAccessible : initialAccessible
    const conventionalRemovalValue = hasValue(nextConventional)
      ? nextConventional
      : initialConventional

    if (hasValue(accessibleRemovalValue)) {
      removals.push({
        label: t("application.confirmation.accessibleWaitListLabel"),
        value: accessibleRemovalValue,
      })
    }
    if (hasValue(conventionalRemovalValue)) {
      removals.push({
        label: t("application.confirmation.conventionalWaitListLabel"),
        value: conventionalRemovalValue,
      })
    }
  }

  return { changes, removals }
}
