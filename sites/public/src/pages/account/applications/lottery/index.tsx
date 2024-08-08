import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../../components/account/ApplicationsView"

const LotteryApplications = () => <ApplicationsView filterType={ApplicationsFilterEnum.Lottery} />

export default LotteryApplications
