import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../../components/account/ApplicationsView"

const OpenApplications = () => <ApplicationsView filterType={ApplicationsIndexEnum.open} />

export default OpenApplications
