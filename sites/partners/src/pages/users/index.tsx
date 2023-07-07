import React, { useState } from "react"
import Head from "next/head"
import { t, Drawer, SiteAlert, AlertTypes } from "@bloom-housing/ui-components"
import { User } from "@bloom-housing/backend-core/types"
import Layout from "../../layouts"
import { useListingsData } from "../../lib/hooks"
import { FormUserManage } from "../../components/users/FormUserManage"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import UserDataTable from "./UserDataTable"

type UserDrawerValue = {
  type: "add" | "edit"
  user?: User
}

const Users = () => {
  const [userDrawer, setUserDrawer] = useState<UserDrawerValue | null>(null)
  const [alertMessage, setAlertMessage] = useState({
    type: "alert" as AlertTypes,
    message: undefined,
  })

  const { listingDtos } = useListingsData({
    limit: "all",
  })

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <SiteAlert dismissable alertMessage={alertMessage} sticky={true} timeout={5000} />
      <NavigationHeader className="relative" title={t("nav.users")} />
      <section>
        <UserDataTable setUserDrawer={setUserDrawer} drawerOpen={!!userDrawer} />
      </section>

      <Drawer
        open={!!userDrawer}
        title={userDrawer?.type === "add" ? t("users.addUser") : t("users.editUser")}
        ariaDescription={t("users.addUser")}
        onClose={() => setUserDrawer(null)}
      >
        <FormUserManage
          mode={userDrawer?.type}
          user={userDrawer?.user}
          listings={listingDtos?.items}
          onDrawerClose={() => {
            setUserDrawer(null)
          }}
          setAlertMessage={setAlertMessage}
        />
      </Drawer>
    </Layout>
  )
}

export default Users
