import React, { useEffect, useState, Fragment } from "react"
import Head from "next/head"
import {
  AppearanceBorderType,
  AppearanceStyleType,
  AppStatusItem,
  Button,
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
import moment from "moment"
import { Application } from "@bloom-housing/backend-core/types"

export default () => {
  const [applications, setApplications] = useState([])
  const [deletingApplication, setDeletingApplication] = useState(null)

  useEffect(() => {
    // applicationsService.list().then((apps) => {
    //   setApplications(apps)
    // })
    const listing = {} as any
    const application = {} as Application
    listing.applicationDueDate = moment().add(10, "days").format()
    application.listing = listing
    // TODO: Fix the types here (and probably this shouldn't come from the frontend anyway)
    // application.updatedAt = moment().toDate()
    setApplications([application])
  }, [])

  const noApplicationsSection = (
    <div className="p-8">
      <h2 className="pb-4">It looks like you haven't applied to any listings yet.</h2>
      <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
    </div>
  )
  const modalActions = [
    <Button
      styleType={AppearanceStyleType.primary}
      onClick={() => {
        // applicationsService.delete(deletingApplication.id).then(() => {
        const newApplications = [...applications]
        const deletedAppIndex = applications.indexOf(deletingApplication, 0)
        delete newApplications[deletedAppIndex]
        setDeletingApplication(null)
        setApplications(newApplications)
        // })
      }}
    >
      {t("t.delete")}
    </Button>,
    <Button
      styleType={AppearanceStyleType.secondary}
      border={AppearanceBorderType.borderless}
      onClick={() => {
        setDeletingApplication(null)
      }}
    >
      {t("t.cancel")}
    </Button>,
  ]
  return (
    <>
      <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
        <Modal
          open={deletingApplication}
          title={t("application.deleteThisApplication")}
          ariaDescription={t("application.deleteThisApplication")}
          actions={modalActions}
          hideCloseIcon
        />
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
                    {applications.map((application) => (
                      <AppStatusItem
                        key={application.id}
                        status="inProgress"
                        application={application}
                        setDeletingApplication={setDeletingApplication}
                      />
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
