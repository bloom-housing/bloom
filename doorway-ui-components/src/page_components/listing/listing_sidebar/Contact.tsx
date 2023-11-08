import * as React from "react"
import { Heading, Icon, IconFillColors } from "@bloom-housing/ui-components"
import { ContactAddress } from "./ContactAddress"
import { Address } from "../../../helpers/MultiLineAddress"

export interface ContactProps {
  /** Any number of text sections rendered after the contact information */
  additionalInformation?: { title: string; content: string | React.ReactNode }[]
  /** The contact's address */
  contactAddress?: Address
  /** The contact's company and website */
  contactCompany?: { name: string; website: string }
  /** The contact's email */
  contactEmail?: string
  /** The contact's name */
  contactName?: string
  /** The contact's phone number */
  contactPhoneNumber?: string
  /** Additional information pertaining to the contact's phone number */
  contactPhoneNumberNote?: string
  /** The contact's title */
  contactTitle?: string
  /** Classnames to style the contact's title */
  contactTitleClassname?: string
  /** The text for the section's header */
  sectionTitle: string
  strings: { email?: string; getDirections: string; website?: string }
}

/** Displays information about a contact, including their address, contact information, and notes */
const Contact = ({
  additionalInformation,
  contactAddress,
  contactCompany,
  contactEmail,
  contactName,
  contactPhoneNumber,
  contactPhoneNumberNote,
  contactTitle,
  contactTitleClassname,
  sectionTitle,
  strings,
}: ContactProps) => {
  const formattedPhoneLink = contactPhoneNumber
    ? `tel:${contactPhoneNumber.replace(/[-()]/g, "")}`
    : undefined
  const formattedCompanyWebsite =
    contactCompany?.website && !contactCompany?.website.startsWith("http")
      ? `http://${contactCompany?.website}`
      : contactCompany?.website
  const contactTitleClasses = ["text-gray-700"]
  if (contactTitleClassname) contactTitleClasses.push(contactTitleClassname)

  return (
    <section className="aside-block">
      <Heading priority={4} styleType={"underlineWeighted"}>
        {sectionTitle}
      </Heading>

      {contactName && <p className="text-xl">{contactName}</p>}
      {contactTitle && <p className={contactTitleClasses.join(" ")}>{contactTitle}</p>}
      {contactCompany?.name && <p className="text-gray-700">{contactCompany.name}</p>}

      {contactPhoneNumber && (
        <>
          <p className="mt-3">
            <a href={formattedPhoneLink}>
              <Icon symbol="phone" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
              {contactPhoneNumber}
            </a>
          </p>
          {contactPhoneNumberNote && (
            <p className="text-xs text-gray-700">{contactPhoneNumberNote}</p>
          )}
        </>
      )}

      {contactEmail && (
        <p className="my-3">
          <a href={`mailto:${contactEmail}`}>
            <Icon symbol="mail" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
            {strings?.email && strings?.email}
          </a>
        </p>
      )}

      {formattedCompanyWebsite && (
        <p className="my-3">
          <a href={formattedCompanyWebsite} target="_blank" rel="noreferrer noopener">
            <Icon symbol="globe" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
            {strings?.website && strings?.website}
          </a>
        </p>
      )}

      {contactAddress && (
        <ContactAddress address={contactAddress} mapString={strings.getDirections} />
      )}

      {additionalInformation?.map((info) => {
        return (
          <div key={info.title} className={"my-3"}>
            <Heading priority={3} styleType={"capsWeighted"}>
              {info.title}
            </Heading>
            <div className="text-gray-800 text-sm markdown">{info.content}</div>
          </div>
        )
      })}
    </section>
  )
}

export { Contact as default, Contact }
