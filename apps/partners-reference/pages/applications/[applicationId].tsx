import React, { Fragment, useMemo, useCallback } from "react"
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
  InlineButton,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { applicationDto } = useSingleApplicationData(applicationId)

  const application = applicationDto?.application

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

  const applicationUpdated = useMemo(() => {
    if (!applicationDto) return null

    const momentDate = moment(applicationDto.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [applicationDto])

  const annualIncome = useMemo(() => {
    if (!application) return null

    const { income, incomePeriod } = application
    const numericIncome = parseFloat(income)

    const annual = incomePeriod === "perMonth" ? numericIncome * 12 : numericIncome
    return `${annual.toFixed(2)}`
  }, [application])

  const householdMembersHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    birth: t("application.household.member.dateOfBirth"),
    street: t("t.street"),
    city: t("application.contact.city"),
    state: t("application.contact.state"),
  }

  const householdMembersData = useMemo(() => {
    return application?.householdMembers?.map((item) => ({
      name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      relationship: t(`application.form.options.relationship.${item.relationship}`),
      birth: `${item.birthMonth}/${item.birthDay}/${item.birthYear}`,
      street: item.address.street,
      city: item.address.city,
      state: item.address.state,
    }))
  }, [application])

  const accessibilityLabels = (accessibility) => {
    const labels = []
    if (accessibility.mobility) labels.push(t("application.ada.mobility"))
    if (accessibility.vision) labels.push(t("application.ada.vision"))
    if (accessibility.hearing) labels.push(t("application.ada.hearing"))
    if (labels.length === 0) labels.push(t("t.no"))

    return labels
  }

  const addressCols = useCallback(
    (isMailingAddress) => (
      <>
        <GridCell>
          <ViewItem label={t("application.contact.streetAddress")}>
            {isMailingAddress
              ? application.mailingAddress.street
              : application.applicant.address.street}
          </ViewItem>
        </GridCell>

        <GridCell span={3}>
          <ViewItem label={t("application.contact.apt")}>
            {isMailingAddress
              ? application.mailingAddress.street2
              : application.applicant.address.street2}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.city")}>
            {isMailingAddress
              ? application.mailingAddress.city
              : application.applicant.address.city}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.state")}>
            {isMailingAddress
              ? application.mailingAddress.state
              : application.applicant.address.state}
          </ViewItem>
        </GridCell>

        <GridCell>
          <ViewItem label={t("application.contact.zip")}>
            {isMailingAddress
              ? application.mailingAddress.zipCode
              : application.applicant.address.zipCode}
          </ViewItem>
        </GridCell>
      </>
    ),
    [application]
  )

  if (!applicationDto) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      {/* <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} /> */}
      <PageHeader>
        <p className="font-sans font-semibold uppercase text-3xl">
          {application.applicant.firstName} {application.applicant.lastName}
        </p>

        <p className="font-sans text-base mt-1">{applicationDto.id}</p>
      </PageHeader>

      <section className="border-t bg-white">
        <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
          <InlineButton arrow onClick={() => router.back()}>
            {t("t.back")}
          </InlineButton>

          <div className="status-bar__status md:pl-4 md:w-3/12">
            <Tag success pillStyle>
              {application.status
                ? t(`application.details.applicationStatus.${application.status}`)
                : t(`application.details.applicationStatus.submitted`)}
            </Tag>
          </div>
        </div>
      </section>

      <section className="bg-primary-lighter">
        <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
          <div className="info-card md:w-9/12">
            <GridSection
              className="bg-primary-lighter"
              title={t("application.details.applicationData")}
              inset
            >
              <GridCell>
                <ViewItem label={t("application.details.number")}>{applicationDto.id}</ViewItem>
              </GridCell>

              {application.submissionType && (
                <GridCell>
                  <ViewItem label={t("application.details.type")}>
                    {t(`application.details.submissionType.${application.submissionType}`)}
                  </ViewItem>
                </GridCell>
              )}

              <GridCell>
                <ViewItem label={t("application.details.submittedDate")}>
                  {applicationDate.date}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.timeDate")}>
                  {applicationDate.time}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.language")}>
                  {application.language
                    ? t(`languages.${application.language}`)
                    : t("languages.en")}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.totalSize")}>
                  {application.householdSize}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.submittedBy")}>
                  {application.applicant.firstName} {application.applicant.middleName}{" "}
                  {application.applicant.lastName}
                </ViewItem>
              </GridCell>
            </GridSection>

            <GridSection
              className="bg-primary-lighter"
              title={t("application.household.primaryApplicant")}
              inset
              grid={false}
            >
              <GridSection columns={4}>
                <GridCell>
                  <ViewItem label={t("application.name.firstName")}>
                    {application.applicant.firstName}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.name.middleName")}>
                    {application.applicant.middleName}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.name.lastName")}>
                    {application.applicant.lastName}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.household.member.dateOfBirth")}>
                    {application.applicant.birthMonth}/{application.applicant.birthDay}/
                    {application.applicant.birthYear}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.email")}>{application.applicant.emailAddress}</ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.phone")}>{application.applicant.phoneNumber}</ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("t.secondPhone")}>
                    {application.additionalPhoneNumber
                      ? application.additionalPhoneNumber
                      : t("t.none")}
                  </ViewItem>
                </GridCell>

                <GridCell span={2}>
                  <ViewItem label={t("application.details.preferredContact")}>
                    {application.contactPreferences.map((item) => (
                      <span key={item}>
                        {t(`application.form.options.contact.${item}`)}
                        <br />
                      </span>
                    ))}
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection subtitle={t("application.details.residenceAddress")} columns={4}>
                {addressCols(false)}
              </GridSection>

              <GridSection subtitle={t("application.contact.mailingAddress")} columns={4}>
                {addressCols(application.sendMailToMailingAddress)}
              </GridSection>
            </GridSection>

            {/* alternate contact */}
            {application.alternateContact.type !== "" &&
              application.alternateContact.type !== "noContact" && (
                <GridSection
                  className="bg-primary-lighter"
                  title={t("application.alternateContact.type.label")}
                  inset
                >
                  <GridCell>
                    <ViewItem label={t("application.name.firstName")}>
                      {application.alternateContact.firstName}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.name.lastName")}>
                      {application.alternateContact.lastName}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("t.relationship")}>
                      {t(
                        `application.alternateContact.type.options.${application.alternateContact.type}`
                      )}
                    </ViewItem>
                  </GridCell>

                  {
                    <GridCell>
                      <ViewItem label={t("application.details.agency")}>
                        {application.alternateContact.agency?.length
                          ? application.alternateContact.agency
                          : t("t.none")}
                      </ViewItem>
                    </GridCell>
                  }

                  <GridCell>
                    <ViewItem label={t("t.email")}>
                      {application.alternateContact.emailAddress}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("t.phone")}>
                      {application.alternateContact.phoneNumber}
                    </ViewItem>
                  </GridCell>
                </GridSection>
              )}

            {/* household members */}
            {application.householdSize > 1 && (
              <GridSection
                className="bg-primary-lighter"
                title={t("application.household.householdMembers")}
                grid={false}
                tinted
                inset
              >
                <MinimalTable headers={householdMembersHeaders} data={householdMembersData} />
              </GridSection>
            )}

            {/* household details */}
            <GridSection
              className="bg-primary-lighter"
              title={t("application.review.householdDetails")}
              inset
            >
              <GridCell>
                <ViewItem label={t("application.details.adaPriorities")}>
                  {accessibilityLabels(application.accessibility).map((item) => (
                    <Fragment key={item}>
                      {item}
                      <br />
                    </Fragment>
                  ))}
                </ViewItem>
              </GridCell>
            </GridSection>

            <GridSection
              className="bg-primary-lighter"
              title={t("application.details.preferences")}
              inset
            >
              <GridCell>
                <ViewItem
                  label={`${t("application.details.liveOrWorkIn")} ${t(
                    "application.details.countyName"
                  )}`}
                >
                  {application.preferences.liveIn || application.preferences.workIn
                    ? t("t.yes")
                    : t("t.no")}
                </ViewItem>
              </GridCell>
            </GridSection>

            <GridSection
              className="bg-primary-lighter"
              title={t("application.details.householdIncome")}
              inset
            >
              <GridCell>
                <ViewItem label={t("application.details.annualIncome")}>{annualIncome}</ViewItem>
              </GridCell>
              <GridCell>
                <ViewItem label={t("application.details.vouchers")}>
                  {application.incomeVouchers ? t("t.yes") : t("t.no")}
                </ViewItem>
              </GridCell>
            </GridSection>
          </div>

          <div className="md:w-3/12">
            <ul className="status-messages">
              <li className="status-message">
                <div className="status-message__note text-tiny text-center pt-2">
                  {t("t.lastUpdated")} {applicationUpdated}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  )
}
