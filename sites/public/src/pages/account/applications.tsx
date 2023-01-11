import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import {
  DashBlock,
  DashBlocks,
  HeaderBadge,
  LinkButton,
  t,
  LoadingOverlay,
} from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent, AuthContext, RequireLogin } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { StatusItemWrapper, AppWithListing } from "./StatusItemWrapper"
import { MetaTags } from "../../components/shared/MetaTags"
import { UserStatus } from "../../lib/constants"

const Applications = () => {
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<AppWithListing[]>()
  const [loading, setLoading] = useState(true)
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState()

  useEffect(() => {
    if (profile) {
      pushGtmEvent<PageView>({
        event: "pageView",
        pageTitle: "My Applications",
        status: UserStatus.LoggedIn,
      })
      applicationsService
        .list({ userId: profile.id })
        .then((apps) => {
          apps?.items?.length > 0 ? setApplications(apps.items) : setLoading(false)
        })
        .catch((err) => {
          console.error(`Error fetching applications: ${err}`)
          setError(err)
          setLoading(false)
        })
    }
  }, [profile, applicationsService])

  useEffect(() => {
    if (!applications || (applications && !listLoading)) return
    void Promise.all(
      applications?.map(async (app) => {
        const retrievedListing = await listingsService.retrieve({ id: app?.listing.id })
        app.fullListing = retrievedListing
        return app
      })
    )
      .then((res) => {
        setListLoading(false)
        setApplications(res)
        setLoading(false)
      })
      .catch((err) => {
        console.error(`Error fetching applications: ${err}`)
        setError(err)
        setLoading(false)
      })
  }, [applications, listLoading, listingsService])

  const noApplicationsSection = () => {
    return error ? (
      <div className="p-8">
        <h1 className="pb-4 text-3xl">{`${t("account.errorFetchingApplications")}`}</h1>
      </div>
    ) : (
      <div className="p-8">
        <h1 className="pb-4 text-3xl">{t("account.noApplications")}</h1>
        <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
      </div>
    )
  }
  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("account.myApplications")}</title>
        </Head>
        <MetaTags title={t("account.myApplications")} description="" />
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="flex flex-wrap relative max-w-3xl mx-auto md:py-8">
            <DashBlocks>
              <DashBlock title={t("account.myApplications")} icon={<HeaderBadge />}>
                <LoadingOverlay isLoading={loading}>
                  <Fragment>
                    {applications?.map((application, index) => {
                      return <StatusItemWrapper key={index} application={application} />
                    })}
                  </Fragment>
                </LoadingOverlay>
                {!applications && !loading && noApplicationsSection()}
              </DashBlock>
            </DashBlocks>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Applications
