import React from "react"
import { PageHeader, t } from "@bloom-housing/ui-components"

type ApplicationSecondaryNavProps = {
  title: string
  listingId: string
  flagsQty: number
  children?: React.ReactChild
}

const ApplicationSecondaryNav = ({
  title,
  listingId,
  flagsQty,
  children,
}: ApplicationSecondaryNavProps) => {
  const elements = [
    {
      label: t("nav.applications"),
      path: `/listings/applications?listing=${listingId}`,
    },
    {
      label: t("nav.flags"),
      path: `/listings/flags?listing=${listingId}`,
      content: <>{flagsQty}</>,
    },
  ]

  return (
    <PageHeader title={title} tabNav={elements}>
      {children}
    </PageHeader>
  )
}

export { ApplicationSecondaryNav as default, ApplicationSecondaryNav }
