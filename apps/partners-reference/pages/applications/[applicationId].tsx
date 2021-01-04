import React, { Fragment, useMemo, useCallback, useState } from "react"
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
  StatusAside,
  StatusMessages,
  LinkButton,
  Drawer,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import { IncomePeriod, ApplicationStatus, HouseholdMemberUpdate } from "@bloom-housing/core"

enum AddressColsType {
  "residence" = "residence",
  "mailing" = "mailing",
  "work" = "work",
  "alternateAddress" = "alternateAddress",
  "memberResidence" = "memberResidence",
  "memberWork" = "memberWork",
}

export default function ApplicationsList() {
  const router = useRouter()

  const applicationId = router.query.applicationId as string

  const { application } = useSingleApplicationData(applicationId)

  const applicationDate = useMemo(() => {
    if (!application) return null

    const momentDate = moment(application.submissionDate)
    const date = momentDate.format("MM/DD/YYYY")
    const time = momentDate.format("HH:mm:ss A")

    if (!momentDate.isValid()) {
      return {
        date: t("t.n/a"),
        time: t("t.n/a"),
      }
    }

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

  const [membersDrawer, setMembersDrawer] = useState<HouseholdMemberUpdate | null>(null)

  const householdMembersHeaders = {
    name: t("t.name"),
    relationship: t("t.relationship"),
    birth: t("application.household.member.dateOfBirth"),
    sameResidence: t("application.add.sameResidence"),
    workInRegion: t("application.details.workInRegion"),
    action: "",
  }

  const householdMembersData = useMemo(() => {
    const checkAvailablility = (property) => {
      if (property === "yes") {
        return t("t.yes")
      } else if (property === "no") {
        return t("t.no")
      }

      return t("t.n/a")
    }
    return application?.householdMembers?.map((item) => ({
      name: `${item.firstName} ${item.middleName} ${item.lastName}`,
      relationship: item.relationship
        ? t(`application.form.options.relationship.${item.relationship}`)
        : t("t.n/a"),
      birth:
        item.birthMonth && item.birthDay && item.birthYear
          ? `${item.birthMonth}/${item.birthDay}/${item.birthYear}`
          : t("t.n/a"),
      sameResidence: checkAvailablility(item.sameAddress),
      workInRegion: checkAvailablility(item.workInRegion),
      action: (
        <Button
          type="button"
          className="font-semibold uppercase"
          onClick={() => setMembersDrawer(item)}
          unstyled
        >
          {t("t.view")}
        </Button>
      ),
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
          address[item] = application.applicant.address[item] || t("t.n/a")
        }

        if (type === AddressColsType.mailing) {
          if (application.sendMailToMailingAddress) {
            address[item] = application.mailingAddress[item]
          } else {
            address[item] = application.applicant.address[item] || t("t.n/a")
          }
        }

        if (type === AddressColsType.work) {
          if (application.applicant.workInRegion === "yes") {
            address[item] = application.applicant.workAddress[item] || t("t.n/a")
          } else {
            address[item] = t("t.n/a")
          }
        }

        if (type === AddressColsType.alternateAddress) {
          address[item] = application.alternateContact.mailingAddress[item]
            ? application.alternateContact.mailingAddress[item]
            : t("t.n/a")
        }

        if (type === AddressColsType.memberWork) {
          address[item] = membersDrawer?.workAddress[item]
            ? membersDrawer?.workAddress[item]
            : t("t.n/a")
        }

        if (type === AddressColsType.memberResidence) {
          if (membersDrawer?.sameAddress) {
            address[item] = application.applicant.address[item]
              ? application.applicant.address[item]
              : t("t.n/a")
          } else {
            address[item] = membersDrawer?.address[item] ? membersDrawer?.address[item] : t("t.n/a")
          }
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
    [application, membersDrawer]
  )

  const applicationStatus = useMemo(() => {
    switch (application?.status) {
      case ApplicationStatus.submitted:
        return (
          <Tag styleType={AppearanceStyleType.success} pillStyle>
            {t(`application.details.applicationStatus.submitted`)}
          </Tag>
        )
      case ApplicationStatus.removed:
        return (
          <Tag styleType={AppearanceStyleType.warning} pillStyle>
            {t(`application.details.applicationStatus.removed`)}
          </Tag>
        )
      default:
        return (
          <Tag styleType={AppearanceStyleType.primary} pillStyle>
            {t(`application.details.applicationStatus.draft`)}
          </Tag>
        )
    }
  }, [application])

  if (!application) return null

  return (
    <>
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

            <div className="status-bar__status md:pl-4 md:w-3/12">{applicationStatus}</div>
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
                    {application.language ? t(`languages.${application.language}`) : t("t.n/a")}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.totalSize")}>
                    {!application.householdSize ? 1 : application.householdSize + 1}
                  </ViewItem>
                </GridCell>

                <GridCell>
                  <ViewItem label={t("application.details.submittedBy")}>
                    {application.applicant.firstName && application.applicant.lastName
                      ? `${application.applicant.firstName} ${application.applicant.lastName}`
                      : t("t.n/a")}
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
                      {application.applicant.firstName || t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.name.middleName")}>
                      {application.applicant.middleName || t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.name.lastName")}>
                      {application.applicant.lastName || t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.household.member.dateOfBirth")}>
                      {(() => {
                        const { birthMonth, birthDay, birthYear } = application?.applicant

                        if (birthMonth && birthDay && birthYear) {
                          return `${birthMonth}/${birthDay}/${birthYear}`
                        }

                        return t("t.n/a")
                      })()}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("t.email")} truncated>
                      {application.applicant.emailAddress || t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem
                      label={t("t.phone")}
                      helper={
                        application.applicant.phoneNumberType &&
                        t(
                          `application.contact.phoneNumberTypes.${application.applicant.phoneNumberType}`
                        )
                      }
                    >
                      {application.applicant.phoneNumber || t("t.n/a")}
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
                      {application.additionalPhoneNumber || t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.preferredContact")}>
                      {(() => {
                        if (!application.contactPreferences.length) return t("t.n/a")

                        return application.contactPreferences.map((item) => (
                          <span key={item}>
                            {t(`t.${item}`)}
                            <br />
                          </span>
                        ))
                      })()}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.details.workInRegion")}>
                      {(() => {
                        if (!application.applicant.workInRegion) return t("t.n/a")

                        return application.applicant.workInRegion === "yes" ? t("t.yes") : t("t.no")
                      })()}
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
                          {application.alternateContact.firstName || t("t.n/a")}
                        </ViewItem>
                      </GridCell>

                      <GridCell>
                        <ViewItem label={t("application.name.lastName")}>
                          {application.alternateContact.lastName || t("t.n/a")}
                        </ViewItem>
                      </GridCell>

                      <GridCell>
                        <ViewItem label={t("t.relationship")}>
                          {(() => {
                            if (!application.alternateContact.type) return t("t.n/a")

                            if (application.alternateContact.otherType)
                              return application.alternateContact.otherType

                            return t(
                              `application.alternateContact.type.options.${application.alternateContact.type}`
                            )
                          })()}
                        </ViewItem>
                      </GridCell>

                      {
                        <GridCell>
                          <ViewItem label={t("application.details.agency")}>
                            {application.alternateContact.agency || t("t.n/a")}
                          </ViewItem>
                        </GridCell>
                      }

                      <GridCell>
                        <ViewItem label={t("t.email")}>
                          {application.alternateContact.emailAddress || t("t.n/a")}
                        </ViewItem>
                      </GridCell>

                      <GridCell>
                        <ViewItem label={t("t.phone")}>
                          {application.alternateContact.phoneNumber || t("t.n/a")}
                        </ViewItem>
                      </GridCell>
                    </GridSection>

                    <GridSection subtitle={t("application.contact.address")} columns={3}>
                      {addressCols(AddressColsType.alternateAddress)}
                    </GridSection>
                  </GridSection>
                )}

              {/* household members */}
              {application.householdSize >= 1 && (
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
                  <ViewItem label={t("application.details.preferredUnitSizes")}>
                    {(() => {
                      if (!application?.preferredUnit?.length) return t("t.n/a")

                      return application?.preferredUnit?.map((item) => (
                        <Fragment key={item}>
                          {t(`application.household.preferredUnit.options.${item}`)}
                          <br />
                        </Fragment>
                      ))
                    })()}
                  </ViewItem>
                </GridCell>

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
                    {(() => {
                      if (application.incomeVouchers === null) return t("t.n/a")

                      if (application.incomeVouchers) {
                        return t("t.yes")
                      }

                      return t("t.no")
                    })()}
                  </ViewItem>
                </GridCell>
              </GridSection>

              <GridSection
                className="bg-primary-lighter"
                title={t("application.add.demographicsInformation")}
                inset
                grid={false}
              >
                <GridSection columns={3}>
                  <GridCell>
                    <ViewItem label={t("application.add.ethnicity")}>
                      {application?.demographics?.ethnicity
                        ? t(
                            `application.review.demographics.ethnicityOptions.${application?.demographics?.ethnicity}`
                          )
                        : t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.race")}>
                      {application?.demographics?.race
                        ? t(
                            `application.review.demographics.raceOptions.${application?.demographics?.race}`
                          )
                        : t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.gender")}>
                      {application?.demographics?.gender
                        ? t(
                            `application.review.demographics.genderOptions.${application?.demographics?.gender}`
                          )
                        : t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.sexualOrientation")}>
                      {application?.demographics?.sexualOrientation
                        ? t(
                            `application.review.demographics.sexualOrientationOptions.${application?.demographics?.sexualOrientation}`
                          )
                        : t("t.n/a")}
                    </ViewItem>
                  </GridCell>

                  <GridCell>
                    <ViewItem label={t("application.add.howDidYouHearAboutUs")}>
                      {(() => {
                        if (!application?.demographics?.howDidYouHear?.length) return t("t.n/a")

                        return application.demographics?.howDidYouHear?.map((item) => (
                          <Fragment key={item}>
                            {t(`application.review.demographics.howDidYouHearOptions.${item}`)}
                            <br />
                          </Fragment>
                        ))
                      })()}
                    </ViewItem>
                  </GridCell>
                </GridSection>
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
                      if (application.acceptedTerms === null) {
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

            <div className="md:w-3/12 pl-6">
              <StatusAside
                columns={1}
                actions={[
                  <GridCell key="btn-submitNew">
                    <Button
                      styleType={AppearanceStyleType.secondary}
                      fullWidth
                      onClick={() => {
                        //
                      }}
                    >
                      {t("t.edit")}
                    </Button>
                  </GridCell>,
                  <GridCell className="flex" key="btn-cancel">
                    <LinkButton
                      unstyled
                      fullWidth
                      className="bg-opacity-0 text-red-700"
                      href={`/applications/${applicationId}/edit`}
                    >
                      {t("t.delete")}
                    </LinkButton>
                  </GridCell>,
                ]}
              >
                <StatusMessages lastTimestamp={applicationUpdated} />
              </StatusAside>
            </div>
          </div>
        </section>
      </Layout>

      <Drawer
        open={!!membersDrawer}
        title={t("application.household.householdMember")}
        ariaDescription={t("application.household.householdMember")}
        onClose={() => setMembersDrawer(null)}
      >
        <section className="border rounded-md p-8 bg-white mb-8">
          <GridSection
            title={t("application.details.householdMemberDetails")}
            tinted={true}
            inset={true}
            grid={false}
          >
            <GridSection grid columns={4}>
              <ViewItem
                label={t("application.name.firstName")}
                children={membersDrawer?.firstName || t("t.n/a")}
              />

              <ViewItem
                label={t("application.name.middleName")}
                children={membersDrawer?.middleName || t("t.n/a")}
              />

              <ViewItem
                label={t("application.name.lastName")}
                children={membersDrawer?.lastName || t("t.n/a")}
              />

              <ViewItem
                label={t("application.household.member.dateOfBirth")}
                children={
                  membersDrawer?.birthMonth && membersDrawer?.birthDay && membersDrawer?.birthYear
                    ? `${membersDrawer?.birthMonth}/${membersDrawer?.birthDay}/${membersDrawer?.birthYear}`
                    : t("t.n/a")
                }
              />

              <ViewItem
                label={t("application.add.sameAddressAsPrimary")}
                children={
                  membersDrawer?.sameAddress === null
                    ? t("t.n/a")
                    : membersDrawer?.sameAddress
                    ? t("t.yes")
                    : t("t.no")
                }
              />

              <ViewItem
                label={t("application.add.workInRegion")}
                children={
                  membersDrawer?.workInRegion === null
                    ? t("t.n/a")
                    : membersDrawer?.workInRegion
                    ? t("t.yes")
                    : t("t.no")
                }
              />

              <ViewItem
                label={t("t.relationship")}
                children={
                  membersDrawer?.relationship
                    ? t(`application.form.options.relationship.${membersDrawer?.relationship}`)
                    : t("t.n/a")
                }
              />
            </GridSection>

            <GridSection grid={false} columns={2}>
              <GridSection subtitle={t("application.details.residenceAddress")} columns={3}>
                {addressCols(AddressColsType.memberResidence)}
              </GridSection>

              {membersDrawer?.workInRegion && (
                <GridSection subtitle={t("application.contact.workAddress")} columns={3}>
                  {addressCols(AddressColsType.memberWork)}
                </GridSection>
              )}
            </GridSection>
          </GridSection>
        </section>

        <Button styleType={AppearanceStyleType.primary} onClick={() => setMembersDrawer(null)}>
          {t("t.done")}
        </Button>
      </Drawer>
    </>
  )
}
