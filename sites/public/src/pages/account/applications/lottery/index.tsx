import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../../components/account/ApplicationsView"

const LotteryApplications = () => <ApplicationsView filterType={ApplicationsFilterEnum.lottery} />

export default LotteryApplications
