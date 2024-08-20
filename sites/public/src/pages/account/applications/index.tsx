import React from "react"
import ApplicationsView, {
  ApplicationsIndexEnum,
} from "../../../components/account/ApplicationsView"

const AllApplications = () => <ApplicationsView filterType={ApplicationsIndexEnum.all} />

export default AllApplications
