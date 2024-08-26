import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../../components/account/ApplicationsView"

const ClosedApplications = () => <ApplicationsView filterType={ApplicationsIndexEnum.closed} />

export default ClosedApplications
