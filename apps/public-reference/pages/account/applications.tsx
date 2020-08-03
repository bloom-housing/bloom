import React, { Component } from "react"
import Head from "next/head"
import {
  DashBlock,
  DashBlocks,
  HeaderBadge,
  MetaTags,
  t,
  AppStatusItem,
} from "@bloom-housing/ui-components"
import Layout from "../../layouts/application"
import Archer from "@bloom-housing/listings-service/listings/archer.json"
import { Application } from "@bloom-housing/backend-core/src/entity/application.entity"
import moment from "moment"
import axios from "axios"

export interface ApplicationsProps {
  applications: Application[]
}
export default class extends Component<ApplicationsProps> {
  public static async getInitialProps() {
    let applications = []

    try {
      const response = await axios.get(process.env.listingServiceUrl + "/applications")
      applications = response.data.applications
    } catch (error) {
      console.log(error)
    }

    return { applications }
  }

  public render() {
    const listing = Object.assign({}, Archer) as any
    const application = new Application()
    listing.applicationDueDate = moment().add(10, "days").format()
    return (
      <Layout>
        <Head>
          <title>{t("nav.myApplications")}</title>
        </Head>
        <MetaTags title={t("nav.myApplications")} description="" />
        <div className="p-16" style={{ background: "#f6f6f6" }}>
          <DashBlocks>
            <DashBlock title={t("account.myApplications")} icon={<HeaderBadge />}>
              <AppStatusItem status="inProgress" application={application}></AppStatusItem>
            </DashBlock>
          </DashBlocks>
        </div>
      </Layout>
    )
  }
}
