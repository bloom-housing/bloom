import React, { useContext, useEffect, useState, Fragment } from "react"
import Head from "next/head"
import {
  ApiClientContext,
  AppStatusItem,
  DashBlock,
  DashBlocks,
  HeaderBadge,
  LinkButton,
  MetaTags,
  Modal,
  RequireLogin,
  t,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import moment from "moment"
import { Application } from "@bloom-housing/backend-core/client"

export default () => {
  const { applicationsService } = useContext(ApiClientContext)
  const [applications, setApplications] = useState([])
  const [deletingApplication, setDeletingApplication] = useState(null)

  useEffect(() => {
    // applicationsService.list().then((apps) => {
    //   setApplications(apps)
    // })
    const listing = Object.assign({}, Archer) as any
    const application = {} as Application
    listing.applicationDueDate = moment().add(10, "days").format()
    application.listing = listing
    application.updatedAt = moment().toDate()
    setApplications([application])
  }, [])

  const noApplicationsSection = (
    <div className="p-8">
      <h2 className="pb-4">It looks like you haven't applied to any listings yet.</h2>
      <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
    </div>
  )
  const modalActions = [
    {
      label: t("t.cancel"),
      type: "cancel" as const,
      onClick: () => {
        setDeletingApplication(null)
      },
    },
    {
      label: t("t.delete"),
      type: "primary" as const,
      onClick: () => {
        // applicationsService.delete(deletingApplication.id).then(() => {
        const newApplications = [...applications]
        const deletedAppIndex = applications.indexOf(deletingApplication, 0)
        delete newApplications[deletedAppIndex]
        setDeletingApplication(null)
        setApplications(newApplications)
        // })
      },
    },
  ]
  return (
    <>
      <RequireLogin signInPath={`/sign-in?message=${encodeURIComponent(t("t.loginIsRequired"))}`}>
        <Modal
          open={deletingApplication}
          title={t("application.deleteThisApplication")}
          ariaDescription={t("application.deleteThisApplication")}
          actions={modalActions}
          fullScreen
        ></Modal>
        <Layout>
          <Head>
            <title>{t("nav.myApplications")}</title>
          </Head>
          <MetaTags title={t("nav.myApplications")} description="" />
          <section className="bg-gray-300">
            <div className="flex flex-wrap relative max-w-3xl mx-auto md:py-8">
              <DashBlocks>
                <DashBlock title={t("account.myApplications")} icon={<HeaderBadge />}>
                  <Fragment>
                    {applications.map((application, i) => (
                      <AppStatusItem
                        key={application.id}
                        status="inProgress"
                        application={application}
                        setDeletingApplication={setDeletingApplication}
                      ></AppStatusItem>
                    ))}
                    {applications.length == 0 && noApplicationsSection}
                  </Fragment>
                </DashBlock>
              </DashBlocks>
            </div>
          </section>
        </Layout>
      </RequireLogin>
    </>
  )
}
