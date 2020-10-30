import React, { Fragment, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { applicationDto, applicationLoading, applicationError } = useSingleApplicationData(
    applicationId
  )

  const application = applicationDto?.application as Record<string, any>

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

  const annualIncome = useMemo(() => {
    if (!application) return null

    const { income, incomePeriod } = application
    const annual = incomePeriod === "perMonth" ? income * 12 : income
    return `${annual.toFixed(2)}`
  }, [application])

  const householdMembersHeaders = {
    name: "Name",
    relationship: "Relationship",
    birth: "Date of birth",
    street: "Street",
    city: "City",
    state: "State",
  }

  const householdMembersData = useMemo(() => {
    return application?.householdMembers.map((item) => ({
      name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      relationship: item.relationship,
      birth: `${item.birthMonth}/${item.birthDay}/${item.birthYear}`,
      street: item.street,
      city: item.city,
      state: item.state,
    }))
  }, [application])

  const accessibilityLabels = (accessibility) => {
    const labels = []
    if (accessibility.mobility) labels.push("Mobility Impairments")
    if (accessibility.vision) labels.push("Vision Impairments")
    if (accessibility.hearing) labels.push("Hearing Impairments")
    if (labels.length === 0) labels.push("No")

    return labels
  }

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      {/* <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} /> */}
      <PageHeader>Applications Received</PageHeader>

      {console.log(applicationLoading && "loading...")}
      {console.log(applicationError)}
      {console.log(applicationDto)}

      <section className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
        <button onClick={() => router.back()}>Back</button>

        <div className="status-bar__status md:pl-4 md:w-3/12">
          <Tag success pillStyle>
            Submitted
          </Tag>
        </div>
      </section>

      {applicationDto && (
        <section className="bg-primary-lighter">
          <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
            <div className="info-card md:w-9/12">
              {/*  w-full */}
              <GridSection className="bg-primary-lighter" title="Application Data" inset>
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
                  <GridSection className="bg-primary-lighter" title="Alternate Contact" inset>
                    <GridCell>
                      <ViewItem label="First Name">
                        {application.alternateContact.firstName}
                      </ViewItem>
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
              {application.householdSize > 1 && (
                <GridSection
                  className="bg-primary-lighter"
                  title="Household Members"
                  grid={false}
                  tinted
                  inset
                >
                  <MinimalTable headers={householdMembersHeaders} data={householdMembersData} />
                </GridSection>
              )}

              {/* household details */}
              <GridSection className="bg-primary-lighter" title="Household Details" inset>
                <GridCell>
                  <ViewItem label="ADA Priorities Selected">
                    {accessibilityLabels(application.accessibility).map((item) => (
                      <Fragment key={item}>
                        {item}
                        <br />
                      </Fragment>
                    ))}
                  </ViewItem>
                </GridCell>
              </GridSection>

              {/* TODO: check live/work place */}
              <GridSection className="bg-primary-lighter" title="Application Preferences" inset>
                <GridCell>
                  <ViewItem label="Live or Work in Alameda County"></ViewItem>
                </GridCell>
              </GridSection>

              <GridSection className="bg-primary-lighter" title="Declared Household Income" inset>
                <GridCell>
                  <ViewItem label="Annual Income">{annualIncome}</ViewItem>
                </GridCell>
                <GridCell>
                  <ViewItem label="Housing Voucher or Subsidy">
                    {application.incomeVouchers ? "Yes" : "No"}
                  </ViewItem>
                </GridCell>
              </GridSection>
            </div>

            <div className="md:w-3/12">
              <p className="text-base text-center">Last updated August 1, 2020</p>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
