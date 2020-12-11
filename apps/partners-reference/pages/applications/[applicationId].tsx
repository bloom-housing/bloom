import React, { Fragment, useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  AppearanceStyleType,
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  Button,
  formatIncome,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import { IncomePeriod } from "@bloom-housing/core"

enum AddressColsType {
  "residence" = "residence",
  "mailing" = "mailing",
  "work" = "work",
  "alternateAddress" = "alternateAddress",
}

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { application } = useSingleApplicationData(applicationId)

  const applicationDate = useMemo(() => {
    if (!application) return null

    const momentDate = moment(application.createdAt)
    const date = momentDate.format("MM/DD/YYYY")
    const time = momentDate.format("HH:mm:ss A")

    return {
      date,
      time,
    }
  }, [application])

  const applicationUpdated = useMemo(() => {
    if (!application) return null

    const momentDate = moment(application.updatedAt)

    return momentDate.format("MMMM DD, YYYY")
  }, [application])

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
    (type: AddressColsType) => {
      const address = {
        city: "",
        state: "",
        street: "",
        street2: "",
        zipCode: "",
      }

      Object.keys(address).forEach((item) => {
        if (type === AddressColsType.residence) {
          address[item] = application.applicant.address[item]
        }

        if (type === AddressColsType.mailing) {
          if (application.sendMailToMailingAddress) {
            address[item] = application.mailingAddress[item]
          } else {
            address[item] = application.applicant.address[item]
          }
        }

        if (type === AddressColsType.work) {
          if (application.applicant.workInRegion === "yes") {
            address[item] = application.applicant.workAddress[item]
          } else {
            address[item] = t("t.n/a")
          }
        }

        if (type === AddressColsType.alternateAddress) {
          address[item] = application.alternateContact.mailingAddress[item]
            ? application.alternateContact.mailingAddress[item]
            : t("t.n/a")
        }
      })

      return (
        <>
          <GridCell>
            <ViewItem label={t("application.contact.streetAddress")}>{address.street}</ViewItem>
          </GridCell>

          <GridCell span={2}>
            <ViewItem label={t("application.contact.apt")}>{address.street2}</ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.contact.city")}>{address.city}</ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.contact.state")}>{address.state}</ViewItem>
          </GridCell>

          <GridCell>
            <ViewItem label={t("application.contact.zip")}>{address.zipCode}</ViewItem>
          </GridCell>
        </>
      )
    },
    [application]
  )

  if (!application) return null

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

        <p className="font-sans text-base mt-1">{application.id}</p>
      </PageHeader>

      <section className="border-t bg-white">
        <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
          <Button inlineIcon="left" icon="arrow-back" onClick={() => router.back()}>
            {t("t.back")}
          </Button>

          <div className="status-bar__status md:pl-4 md:w-3/12">
            <Tag type={AppearanceStyleType.success} pillStyle>
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
                <ViewItem label={t("application.details.number")}>{application.id}</ViewItem>
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
              <GridSection columns={3}>
                <GridCell>
                  <ViewItem label={t("application.name.firstName")}>
                    {application.applicant.firstName}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.name.middleName")}>
                    {application.applicant.middleName
                      ? application.applicant.middleName
                      : t("t.n/a")}
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
                  <ViewItem label={t("t.email")} truncated>
                    {application.applicant.emailAddress}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem
                    label={t("t.phone")}
                    helper={t(
                      `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
                    )}
                  >
                    {application.applicant.phoneNumber}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem
                    label={t("t.secondPhone")}
                    helper={
                      application.additionalPhoneNumber &&
                      t(
                        `application.contact.phoneNumberTypes.${application.additionalPhoneNumberType}`
                      )
                    }
                  >
                    {application.additionalPhoneNumber
                      ? application.additionalPhoneNumber
                      : t("t.none")}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.preferredContact")}>
                    {application.contactPreferences.map((item) => (
                      <span key={item}>
                        {t(`t.${item}`)}
                        <br />
                      </span>
                    ))}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.workInRegion")}>
                    {application.applicant.workInRegion === "yes" ? t("t.yes") : t("t.no")}
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection subtitle={t("application.details.residenceAddress")} columns={3}>
                {addressCols(AddressColsType.residence)}
              </GridSection>

              <GridSection subtitle={t("application.contact.mailingAddress")} columns={3}>
                {addressCols(AddressColsType.mailing)}
              </GridSection>

              <GridSection subtitle={t("application.contact.workAddress")} columns={3}>
                {addressCols(AddressColsType.work)}
              </GridSection>
            </GridSection>

            {/* alternate contact */}
            {application.alternateContact.type !== "" &&
              application.alternateContact.type !== "noContact" && (
                <GridSection
                  className="bg-primary-lighter"
                  title={t("application.alternateContact.type.label")}
                  inset
                  grid={false}
                >
                  <GridSection columns={3}>
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
                        {application.alternateContact.emailAddress
                          ? application.alternateContact.emailAddress
                          : t("t.n/a")}
                      </ViewItem>
                    </GridCell>

                    <GridCell>
                      <ViewItem label={t("t.phone")}>
                        {application.alternateContact.phoneNumber}
                      </ViewItem>
                    </GridCell>
                  </GridSection>

                  <GridSection subtitle={t("application.contact.address")} columns={3}>
                    {addressCols(AddressColsType.alternateAddress)}
                  </GridSection>
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
              columns={3}
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
                <ViewItem label={t("application.details.annualIncome")}>
                  {application.incomePeriod === IncomePeriod.perYear
                    ? formatIncome(
                        parseFloat(application.income),
                        application.incomePeriod,
                        IncomePeriod.perYear
                      )
                    : t("t.n/a")}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.monthlyIncome")}>
                  {application.incomePeriod === IncomePeriod.perMonth
                    ? formatIncome(
                        parseFloat(application.income),
                        application.incomePeriod,
                        IncomePeriod.perMonth
                      )
                    : t("t.n/a")}
                </ViewItem>
              </GridCell>

              <GridCell>
                <ViewItem label={t("application.details.vouchers")}>
                  {application.incomeVouchers ? t("t.yes") : t("t.no")}
                </ViewItem>
              </GridCell>
            </GridSection>

            <GridSection
              className="bg-primary-lighter"
              title={t("application.review.terms.title")}
              inset
              grid={false}
            >
              <GridCell>
                <ViewItem label={t("application.details.signatureOnTerms")}>
                  {(() => {
                    if (typeof application.acceptedTerms == "undefined") {
                      return t("t.n/a")
                    } else if (application.acceptedTerms) {
                      return t("t.yes")
                    } else {
                      return t("t.no")
                    }
                  })()}
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
