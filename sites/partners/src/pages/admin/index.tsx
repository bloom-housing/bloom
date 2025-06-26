import { useContext } from "react"
import Head from "next/head"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { t } from "@bloom-housing/ui-components"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"

const Admin = () => {
  const { profile } = useContext(AuthContext)

  if (!profile || !profile?.userRoles?.isSuperAdmin) {
    console.log("HERE")
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <NavigationHeader className="relative" title={t("t.administration")} />
    </Layout>
  )
}

export default Admin
