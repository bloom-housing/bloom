import * as React from "react"
import { ContactAddress } from "./ContactAddress"
import { Icon, IconFillColors } from "../../../icons/Icon"
import { Address } from "./MultiLineAddress"

export interface ContactProps {
  additionalInformation?: { title: string; content: string | React.ReactNode }[]
  contactAddress?: Address
  contactCompany?: { name: string; website: string }
  contactEmail?: string
  contactName?: string
  contactPhoneNumber?: string
  contactPhoneNumberNote?: string
  contactTitle?: string
  emailString?: string
  sectionTitle: string
  mapString?: string
  websiteString?: string
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
  emailString,
  sectionTitle,
  mapString,
  websiteString,
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
          <p className="mt-5">
            <a href={formattedPhoneLink}>
              <Icon symbol="phone" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
              {contactPhoneNumber}
            </a>
          </p>
          {contactPhoneNumberNote && (
            <p className="text-sm text-gray-700 pl-6">{contactPhoneNumberNote}</p>
          )}
        </>
      )}

      {contactEmail && (
        <p className="my-5">
          <a href={`mailto:${contactEmail}`}>
            <Icon symbol="mail" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
            {emailString && emailString}
          </a>
        </p>
      )}

      {formattedCompanyWebsite && (
        <p className="my-5">
          <a href={formattedCompanyWebsite} target="_blank" rel="noreferrer noopener">
            <Icon symbol="globe" size="medium" fill={IconFillColors.primary} className={"pr-2"} />
            {websiteString && websiteString}
          </a>
        </p>
      )}

      {contactAddress && <ContactAddress address={contactAddress} mapString={mapString} />}

      {additionalInformation?.map((info) => {
        return (
          <>
            <h3 className="text-caps-tiny ">{info.title}</h3>
            <div className="text-gray-800 text-tiny markdown">{info.content}</div>
          </>
        )
      })}
    </section>
  )
}

export { Contact as default, Contact }
