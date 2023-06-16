import React from "react"
import dayjs from "dayjs"
import { NextRouter } from "next/router"
import {
  Address,
  Listing,
  ListingReviewOrder,
  UnitsSummarized,
  ListingStatus,
  ApplicationMultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import { t, ApplicationStatusType, MenuLink, StatusBarType } from "@bloom-housing/ui-components"
import {
  FooterNav,
  FooterSection,
  ListingCard,
  SiteFooter,
  SiteHeader,
} from "@bloom-housing/doorway-ui-components"
import { imageUrlFromListing, getSummariesTable } from "@bloom-housing/shared-helpers"

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const getGenericAddress = (bloomAddress: Address) => {
  return bloomAddress
    ? {
        city: bloomAddress.city,
        county: bloomAddress.county,
        street: bloomAddress.street,
        street2: bloomAddress.street2,
        state: bloomAddress.state,
        zipCode: bloomAddress.zipCode,
        latitude: bloomAddress.latitude,
        longitude: bloomAddress.longitude,
        placeName: bloomAddress.placeName,
      }
    : null
}

export const disableContactFormOption = (id: string, noPhone: boolean, noEmail: boolean) => {
  if (id === "phone" || id === "text") {
    return noPhone
  }
  return id === "email" && noEmail
}

export const openInFuture = (listing: Listing) => {
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (
  unitsSummarized: UnitsSummarized,
  listingReviewOrder: ListingReviewOrder,
  includeRentandMinimumIncome: boolean
) => {
  return unitsSummarized !== undefined
    ? getSummariesTable(
        unitsSummarized.byUnitTypeAndRent,
        listingReviewOrder,
        includeRentandMinimumIncome
      )
    : []
}

export const getListingUrl = (listing: Listing) => {
  if (listing.isExternal) {
    return `/listing/ext/${listing.id}`
  } else {
    return `/listing/${listing.id}/${listing.urlSlug}`
  }
}

export const getListingApplicationStatus = (listing: Listing): StatusBarType => {
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let status = ApplicationStatusType.Open

  if (openInFuture(listing)) {
    const date = listing.applicationOpenDate
    const openDate = dayjs(date)
    formattedDate = openDate.format("MMM D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.status === ListingStatus.closed) {
      status = ApplicationStatusType.Closed
      content = t("listings.applicationsClosed")
    } else if (listing.applicationDueDate) {
      const dueDate = dayjs(listing.applicationDueDate)
      formattedDate = dueDate.format("MMM DD, YYYY")
      formattedDate = formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mmA")

      // if due date is in future, listing is open
      if (dayjs() < dueDate) {
        content = t("listings.applicationDeadline")
      } else {
        status = ApplicationStatusType.Closed
        content = t("listings.applicationsClosed")
      }
    }
  }

  if (formattedDate != "") {
    content = content + `: ${formattedDate}`
  }

  if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
    subContent = content
    content = t("listings.applicationFCFS")
  }

  return {
    status,
    content,
    subContent,
  }
}

const unitSummariesHeaders = {
  unitType: "t.unitType",
  minimumIncome: "t.minimumIncome",
  rent: "t.rent",
}

export const getListings = (listings: Listing[]) => {
  return listings.map((listing: Listing, index: number) => {
    return getListingCard(listing, index)
  })
}

export const getListingCard = (listing: Listing, index: number) => {
  const uri = getListingUrl(listing)
  const displayIndex: string = (index + 1).toString()
  return (
    <ListingCard
      key={index}
      preheader={listing?.buildingAddress?.county}
      imageCardProps={{
        imageUrl: imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0] || "",
        tags: listing.reservedCommunityType
          ? [
              {
                text: t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`),
              },
            ]
          : undefined,
        statuses: [],
        description: listing.name,
      }}
      tableProps={{
        headers: unitSummariesHeaders,
        data: getListingTableData(listing.unitsSummarized, listing.reviewOrderType, false),
        responsiveCollapse: true,
        cellClassName: "px-5 py-3",
      }}
      footerButtons={[
        {
          text: t("t.seeDetails"),
          href: uri,
          ariaHidden: true,
        },
      ]}
      contentProps={{
        contentHeader: {
          content: displayIndex + ". " + listing.name,
          href: uri,
          makeCardClickable: true,
        },
        contentSubheader: { content: getListingCardSubtitle(listing.buildingAddress) },
      }}
    />
  )
}

export const untranslateMultiselectQuestion = (
  data: ApplicationMultiselectQuestion[],
  listing: Listing
) => {
  const multiselectQuestions = listing?.listingMultiselectQuestions ?? []

  data.forEach((datum) => {
    const question = multiselectQuestions.find(
      (elem) => elem.multiselectQuestion.text === datum.key
    )?.multiselectQuestion

    if (question) {
      datum.key = question.untranslatedText ?? question.text

      if (datum.options) {
        datum.options.forEach((option) => {
          const selectedOption = question.options.find((elem) => elem.text === option.key)

          if (selectedOption) {
            option.key = selectedOption.untranslatedText ?? selectedOption.text
          } else if (question.optOutText === option.key) {
            option.key = question.untranslatedOptOutText ?? question.optOutText
          }

          if (option.extraData) {
            option.extraData.forEach((extra) => {
              extra.key = selectedOption.untranslatedText ?? selectedOption.text
            })
          }
        })
      }
    }
  })
}

// FYI when auth/logging in is re-enabled, you'll need to pass in
// call `const { profile, signOut } = useContext(AuthContext)`
// from the layout and pass into this function.
export const getSiteHeader = (router: NextRouter) => {
  const languages =
    router?.locales?.map((item) => ({
      prefix: item === "en" ? "" : item,
      label: t(`languages.${item}`),
    })) || []

  const menuLinks: MenuLink[] = [
    {
      title: t("pageTitle.welcome"),
      href: "/",
    },
    {
      title: t("nav.viewListings"),
      href: "/listings",
    },
    {
      title: t("nav.helpCenter"),
      href: "#",
      subMenuLinks: [
        {
          title: t("pageTitle.getStarted"),
          href: "/help/get-started",
        },
        {
          title: t("pageTitle.housingHelp"),
          href: "/help/housing-help",
        },
        {
          title: t("pageTitle.questions"),
          href: "/help/questions",
        },
      ],
    },
  ]
  if (process.env.housingCounselorServiceUrl) {
    menuLinks.push({
      title: t("pageTitle.getAssistance"),
      href: process.env.housingCounselorServiceUrl,
    })
  }
  // TODO: Uncomment when applications are re-enabled
  // if (profile) {
  //   menuLinks.push({
  //     title: t("nav.myAccount"),
  //     subMenuLinks: [
  //       {
  //         title: t("nav.myDashboard"),
  //         href: "/account/dashboard",
  //       },
  //       {
  //         title: t("account.myApplications"),
  //         href: "/account/applications",
  //       },
  //       {
  //         title: t("account.accountSettings"),
  //         href: "/account/edit",
  //       },
  //       {
  //         title: t("nav.signOut"),
  //         onClick: () => {
  //           const signOutFxn = async () => {
  //             setSiteAlertMessage(t(`authentication.signOut.success`), "notice")
  //             await router.push("/sign-in")
  //             signOut()
  //           }
  //           void signOutFxn()
  //         },
  //       },
  //     ],
  //   })
  // } else {
  // menuLinks.push({
  //   title: t("nav.signIn"),
  //   href: "/sign-in",
  // })
  // }
  return (
    <SiteHeader
      logoSrc="/images/doorway-logo.png"
      homeURL="/"
      mainContentId="main-content"
      languages={languages.map((lang) => {
        return {
          label: lang.label,
          onClick: () =>
            void router.push(router.asPath, router.asPath, { locale: lang.prefix || "en" }),
          active: t("config.routePrefix") === lang.prefix,
        }
      })}
      menuLinks={menuLinks.map((menuLink) => {
        return {
          ...menuLink,
          className: router.pathname === menuLink.href ? "secondary" : "",
        }
      })}
      strings={{ skipToMainContent: t("t.skipToMainContent") }}
    />
  )
}

export const getSiteFooter = () => {
  return (
    <SiteFooter>
      <FooterSection sectionClassName="justify-between" small>
        <div className="text-left">
          <img
            className="h-20 w-20 mr-3"
            src="/images/bahfa-logo.png"
            alt={t("footer.bahfaLogo")}
          />
          <img className="h-24 w-96" src="/images/mtc-abag-logo.svg" alt={t("footer.mtcLogo")} />
          <p className="mt-8 text-white">
            375 Beale Street, Suite 800
            <br /> San Francisco, CA 94105-2066
            <br /> {t("footer.mondayToFriday")}
            <br />
            <a href="mailto: bahfa@bayareametro.gov" className="underline">
              bahfa@bayareametro.gov
            </a>
          </p>
        </div>
        <div className="text-left">
          <FooterNav>
            <a href="https://mtc.ca.gov/doorway-housing-portal-privacy-policy" target="_blank">
              {t("pageTitle.privacy")}
            </a>
            <a href="https://mtc.ca.gov/doorway-housing-portal-terms-use" target="_blank">
              {t("pageTitle.termsOfUse")}
            </a>
            <a href="https://mtc.ca.gov/bahfa-non-discrimination-statement" target="_blank">
              {t("pageTitle.bahfaNonDiscriminationStatement")}
            </a>
            <a
              href="https://mtc.ca.gov/about-mtc/public-participation/language-assistance"
              target="_blank"
            >
              {t("pageTitle.languageAssistance")}
            </a>
          </FooterNav>
          <a href="https://twitter.com/mtcbata" target="_blank">
            <img
              className="h-10 w-10 mr-4"
              src="/images/twitter-logo.svg"
              alt={t("footer.twitterLogo")}
            />
          </a>
          <a
            href="https://www.linkedin.com/company/metropolitan-transportation-commission"
            target="_blank"
          >
            <img
              className="h-10 w-10 mr-4"
              src="/images/linkedin-logo.svg"
              alt={t("footer.linkedinLogo")}
            />
          </a>
          <a href="https://www.facebook.com/MTCBATA" target="_blank">
            <img
              className="h-10 w-10 mr-4"
              src="/images/facebook-logo.svg"
              alt={t("footer.facebookLogo")}
            />
          </a>
          <a href="https://www.youtube.com/user/mtcabaglibrary" target="_blank">
            <img
              className="h-10 w-10 mr-4"
              src="/images/youtube-logo.svg"
              alt={t("footer.youtubeLogo")}
            />
          </a>
          <a href="https://www.instagram.com/mtcbata/" target="_blank">
            <img
              className="h-10 w-10 mr-4"
              src="/images/instagram-logo.svg"
              alt={t("footer.instagramLogo")}
            />
          </a>
        </div>
      </FooterSection>
      <div className="bg-gray-950">
        <FooterSection
          small
          sectionClassName="items:start md:items-center justify-start md:justify-between"
        >
          <div>{t("footer.bahfaCopyright")}</div>
          <div>
            <img className="h-20 w-20" src="/images/eho-logo.svg" alt={t("footer.ehoLogo")} />
          </div>
        </FooterSection>
      </div>
    </SiteFooter>
  )
}
