import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../../components/account/ApplicationsView"

const OpenApplications = () => <ApplicationsView filterType={ApplicationsFilterEnum.open} />

export default OpenApplications
