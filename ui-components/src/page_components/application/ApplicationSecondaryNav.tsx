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
      path: `/listings/${listingId}/applications`,
    },
    {
      label: t("nav.flags"),
      path: `/listings/${listingId}/flags`,
      content: <>{flagsQty}</>,
    },
  ]

  return (
    <PageHeader title={title} tabNav={process.env.showDuplicates ? elements : []}>
      {children}
    </PageHeader>
  )
}

export { ApplicationSecondaryNav as default, ApplicationSecondaryNav }
