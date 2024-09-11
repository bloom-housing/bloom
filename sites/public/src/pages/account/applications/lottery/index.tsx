import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../../components/account/ApplicationsView"

const LotteryApplications = () => <ApplicationsView filterType={ApplicationsIndexEnum.lottery} />

export default LotteryApplications
