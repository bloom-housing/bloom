import React, { Component, Fragment } from "react"
import Head from "next/head"
import {
  DashBlock,
  DashBlocks,
  HeaderBadge,
  MetaTags,
  t,
  AppStatusItem,
  LinkButton,
  // ApiClientContext,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import moment from "moment"
import { Application } from "@bloom-housing/backend-core/client"

export interface ApplicationsProps {
  applications: Application[]
}
export default class extends Component<ApplicationsProps> {
  public render() {
    const listing = Object.assign({}, Archer) as any
    const application = {} as Application
    listing.applicationDueDate = moment().add(10, "days").format()
    application.listing = listing
    application.updatedAt = moment().toDate()
    // const applications = []
    const applications = [application]

    // const apps = (
    //   <ApiClientContext.Consumer>
    //     {(props) => {
    //       // TODO: Fix static method build error
    //       const applications = props.applicationsService.list()

    //       return (
    //         <>
    //           {applications.map((application) => (
    //             <AppStatusItem status="inProgress" application={application}></AppStatusItem>
    //           ))}
    //         </>
    //       )
    //     }}
    //   </ApiClientContext.Consumer>
    // )
    const noApplicationsSection = (
      <div className="p-8">
        <h2 className="pb-4">It looks like you haven't applied to any listings yet.</h2>
        <LinkButton href="/listings">{t("listings.browseListings")}</LinkButton>
      </div>
    )
    return (
      <Layout>
        <Head>
          <title>{t("nav.myApplications")}</title>
        </Head>
        <MetaTags title={t("nav.myApplications")} description="" />
        <div className="p-16" style={{ background: "#f6f6f6" }}>
          <DashBlocks>
            <DashBlock title={t("account.myApplications")} icon={<HeaderBadge />}>
              <Fragment>
                {applications.map((application, i) => (
                  <AppStatusItem
                    key={"application" + i}
                    status="inProgress"
                    application={application}
                  ></AppStatusItem>
                ))}
                {applications.length == 0 && noApplicationsSection}
              </Fragment>
            </DashBlock>
          </DashBlocks>
        </div>
      </Layout>
    )
  }
}
