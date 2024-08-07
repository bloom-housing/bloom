import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../../components/account/ApplicationsView"

const Applications = () => <ApplicationsView filterType={ApplicationsFilterEnum.Lottery} />

export default Applications
