import { useEffect } from "react"
import { useRouter } from "next/router"
import { AdminIndexEnum, adminPath, useAdminTabs } from "../../components/admin/AdminViewHelpers"

const Admin = () => {
  const router = useRouter()
  const { visibleTabs } = useAdminTabs(AdminIndexEnum.featureFlags)
  const firstTab = visibleTabs[0]

  useEffect(() => {
    void router.replace(firstTab === undefined ? "/unauthorized" : adminPath(firstTab))
  }, [router, firstTab])

  return null
}

export default Admin
