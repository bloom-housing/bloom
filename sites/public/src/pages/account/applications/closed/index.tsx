import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../../components/account/ApplicationsView"

const ClosedApplications = () => <ApplicationsView filterType={ApplicationsFilterEnum.closed} />

export default ClosedApplications
