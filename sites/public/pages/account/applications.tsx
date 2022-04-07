import React, { useEffect, useState, Fragment, useContext } from "react"
import Head from "next/head"
import {
  AuthContext,
  DashBlock,
  DashBlocks,
  HeaderBadge,
  LinkButton,
  RequireLogin,
  t,
  LoadingOverlay,
} from "@bloom-housing/ui-components"
import { PageView, pushGtmEvent } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts/application"
import { Listing, PaginatedApplication } from "@bloom-housing/backend-core/types"
import { StatusItemWrapper } from "./StatusItemWrapper"
import { MetaTags } from "../../src/MetaTags"
import { UserStatus } from "../../lib/constants"

const Applications = () => {
  const { applicationsService, listingsService, profile } = useContext(AuthContext)
  const [applications, setApplications] = useState<PaginatedApplication>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState<Listing[]>([])

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
          setApplications(apps)
        })
        .catch((err) => {
          console.error(`Error fetching applications: ${err}`)
          setError(`${err}`)
          setLoading(false)
        })
    }
  }, [profile, applicationsService])
  let start = new Date().getTime()
  useEffect(() => {
    const listingsArr = async () => {
      const listArr = []
      for (const application of applications?.items) {
        try {
          const retrievedListing = await listingsService.retrieve({ id: application?.listing.id })
          listArr.push(retrievedListing)
        } catch (err) {
          console.error(`Error fetching listing: ${err}`)
        }
      }
      return listArr
    }
    if (applications?.items.length > 0) {
      void listingsArr().then((results) => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        start = new Date().getTime()
        setListings(results)
        setLoading(false)
      })
    }
  }, [applications, listingsService])

  const noApplicationsSection = () => {
    return error ? (
      <div className="p-8">
        <h2 className="pb-4">{`${t("account.errorFetchingApplications")}`}</h2>
      </div>
    ) : (
      <div className="p-8">
        <h2 className="pb-4">{t("account.noApplications")}</h2>
        <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
      </div>
    )
  }

  return (
    <RequireLogin signInPath="/sign-in" signInMessage={t("t.loginIsRequired")}>
      <Layout>
        <Head>
          <title>{t("nav.myApplications")}</title>
        </Head>
        <MetaTags title={t("nav.myApplications")} description="" />
        <section className="bg-gray-300 border-t border-gray-450">
          <div className="flex flex-wrap relative max-w-3xl mx-auto md:py-8">
            <DashBlocks>
              <DashBlock title={t("account.myApplications")} icon={<HeaderBadge />}>
                <LoadingOverlay
                  isLoading={loading && !applications?.items?.length && !listings?.length}
                >
                  <Fragment>
                    test
                    {applications?.items?.length > 0 &&
                      listings?.length > 0 &&
                      applications.items.map((application, index) => {
                        console.log(new Date().getTime() - start)
                        //temporary solution to test speed
                        const currentListing = listings[index]
                        return (
                          <StatusItemWrapper
                            key={index}
                            application={application}
                            listing={currentListing}
                          />
                        )
                      })}
                  </Fragment>
                </LoadingOverlay>
                {applications?.items.length < 1 && !loading && noApplicationsSection()}
              </DashBlock>
            </DashBlocks>
          </div>
        </section>
      </Layout>
    </RequireLogin>
  )
}

export default Applications
