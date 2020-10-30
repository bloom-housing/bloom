import React, { useState, useEffect, useContext, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  Field,
  PageHeader,
  MetaTags,
  t,
  Button,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  ApiClientContext,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { applicationDto, applicationLoading, applicationError } = useSingleApplicationData(
    applicationId
  )

  const { application } = applicationDto || {}

  const applicationDate = useMemo(() => {
    if (!applicationDto) return null

    const momentDate = moment(applicationDto.createdAt)
    const date = momentDate.format("MM/DD/YYYY")
    const time = momentDate.format("HH:mm:ss A")

    return {
      date,
      time,
    }
  }, [applicationDto])

  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])
  if (!hasMounted) {
    return null
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      {/* <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} /> */}
      <PageHeader>Applications Received</PageHeader>

      <section>
        <div className="row">
          <Tag success pillStyle>
            Submitted
          </Tag>
        </div>
        {console.log(applicationLoading && "loading...")}
        {console.log(applicationError)}
        {console.log(applicationDto)}
      </section>

      {applicationDto && (
        <section className="bg-primary-lighter flex flex-wrap px-5">
          <div className="bg-white pa-3">
            <GridSection className="bg-primary-lighter" title="Application Data">
              <GridCell>
                <ViewItem label="Application Number">{applicationDto.id}</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Application Submission Type">Electronic</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Application Submitted Date">{applicationDate.date}</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Application Time Date">{applicationDate.time}</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Application Language">English</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Total Household Size">{application.householdSize}</ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label="Submitted By">
                  {application.applicant.firstName} {application.applicant.middleName}{" "}
                  {application.applicant.lastName}
                </ViewItem>
              </GridCell>
            </GridSection>

            {/* alternate contact */}
            {application.alternateContact.type !== "" &&
              application.alternateContact.type !== "noContact" && (
                <GridSection className="bg-primary-lighter" title="Alternate Contact">
                  <GridCell>
                    <ViewItem label="First Name">{application.alternateContact.firstName}</ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label="Last Name">{application.alternateContact.lastName}</ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label="Relationship">{application.alternateContact.type}</ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label="Agency if Applicable">
                      {application.alternateContact.agency.length
                        ? application.alternateContact.agency
                        : "None"}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label="Email">{application.alternateContact.emailAddress}</ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label="Phone">{application.alternateContact.phoneNumber}</ViewItem>
                  </GridCell>
                </GridSection>
              )}

            {/* household members */}
          </div>

          <span>Last updated August 1, 2020</span>
        </section>
      )}
    </Layout>
  )
}
