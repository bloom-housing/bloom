import { useContext, useEffect } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { AdminIndexEnum, adminPath, useAdminTabs } from "../../components/admin/AdminViewHelpers"

const Admin = () => {
  const router = useRouter()
  const { profile } = useContext(AuthContext)
  const { visibleTabs } = useAdminTabs(AdminIndexEnum.featureFlags)
  const firstTab = visibleTabs[0]

  useEffect(() => {
    if (!profile) return
    void router.replace(firstTab === undefined ? "/unauthorized" : adminPath(firstTab))
  }, [router, profile, firstTab])

  return null
}

export default Admin
