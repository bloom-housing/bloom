import React from "react"
import Router from "next/router"
import { HouseholdMember, Listing } from "@bloom-housing/core"
import { t } from "../helpers/translator"

export interface HouseholdSizeFieldProps {
  listing: Listing
  application: any
}

const HouseholdSizeField = (props: HouseholdSizeFieldProps) => {
  const { listing, application } = props

  return (
    <div className="info-item mb-4 pb-4 border-b text-left">
      <p className="info-item__value">
        {member.firstName} {member.lastName}
      </p>
      <h4 className="info-item__name">{type}</h4>
      <a className="edit-link info-item__link" href="#" onClick={editMember}>
        {t("label.edit")}
      </a>
    </div>
  )
}

export { HouseholdSizeField as default, HouseholdSizeField }
