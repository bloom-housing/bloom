import * as React from "react"
import { ContactAddress } from "./ContactAddress"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { Address } from "./MultiLineAddress"
import Heading from "../../../headers/Heading"

export interface ContactProps {
  additionalInformation?: { title: string; content: string | React.ReactNode }[]
  contactAddress?: Address
  contactCompany?: { name: string; website: string }
  contactEmail?: string
  contactName?: string
  contactPhoneNumber?: string
  contactPhoneNumberNote?: string
  contactTitle?: string
  sectionTitle: string
  strings?: { email?: string; getDirections?: string; website?: string }
}

const Contact = ({
  additionalInformation,
  contactAddress,
  contactCompany,
  contactEmail,
  contactName,
  contactPhoneNumber,
  contactPhoneNumberNote,
  contactTitle,
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

  return (
    <section className="aside-block">
      <h4 className="text-caps-underline">{sectionTitle}</h4>

      {contactName && <p className="text-xl">{contactName}</p>}
      {contactTitle && <p className="text-gray-700">{contactTitle}</p>}
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
            <p className="text-sm text-gray-700">{contactPhoneNumberNote}</p>
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
        <ContactAddress address={contactAddress} mapString={strings?.getDirections} />
      )}

      {additionalInformation?.map((info) => {
        return (
          <>
            <Heading priority={3} style={"sidebarSubHeader"}>
              {info.title}
            </Heading>
            <div className="text-gray-800 text-tiny markdown">{info.content}</div>
          </>
        )
      })}
    </section>
  )
}

export { Contact as default, Contact }
