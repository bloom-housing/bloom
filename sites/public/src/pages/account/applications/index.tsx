import React from "react"
import ApplicationsView, {
  ApplicationsFilterEnum,
} from "../../../components/account/ApplicationsView"

const AllApplications = () => <ApplicationsView filterType={ApplicationsFilterEnum.all} />

export default AllApplications
