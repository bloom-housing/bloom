import React from "react"
import { PageHeader, t } from "@bloom-housing/ui-components"

type ListingSecondaryNavProps = {
  title: string
  listingId: string
  flagsQty: number
  children?: React.ReactChild
}

const ListingSecondaryNav = ({
  title,
  listingId,
  flagsQty,
  children,
}: ListingSecondaryNavProps) => {
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

export { ListingSecondaryNav as default, ListingSecondaryNav }
