import * as React from "react"
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion"
import { ContentSection } from "../../sections/content_section"
import { ListSection } from "../../sections/list_section"
import { InfoCard } from "../../cards/info_card"
import { Description } from "../../atoms/description"
import ListingAccordionItem from "../ListingAccordionItem/ListingAccordionItem"

import { Listing } from "@dahlia/ui-components/src/types"

interface ListingAccordionProps {
  listing: Listing
}

const ListingAccordion = (props: ListingAccordionProps) => {
  const listing = props.listing

  return (
    <Accordion allowZeroExpanded allowMultipleExpanded>
      <ListingAccordionItem
        imageAlt="eligibility-notebook"
        imageSrc="/static/images/listing-eligibility.svg"
        title="Eligibility"
        subtitle="Income, occupancy, preferences, and subsidies"
        uuid="eligibility"
      >
        <ContentSection>
          <ul>
            <ListSection
              title="Household Maximum Income"
              subtitle="For income calculations, household size includes everyone (all ages) living in the unit."
            >
              <>table goes here…</>
            </ListSection>

            <ListSection
              title="Occupancy"
              subtitle="Occupancy limits for this building differ from household size, and do not include children under 6."
            >
              <>table goes here…</>
            </ListSection>

            <ListSection
              title="Rental Assistance"
              subtitle="Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be
                    considered for this property. In the case of a valid rental subsidy, the required minimum income
                    will be based on the portion of the rent that the tenant pays after use of the subsidy."
            />

            <ListSection
              title="Housing Preferences"
              subtitle="Preference holders will be given highest ranking."
            >
              <>table goes here…</>
            </ListSection>

            <ListSection
              title="Additional Eligibility Rules"
              subtitle="Applicants must also qualify under the rules of the building."
            >
              <>
                <InfoCard title="Credit History">
                  <p className="text-sm text-gray-700">{listing.credit_history}</p>
                </InfoCard>
                <InfoCard title="Rental History">
                  <p className="text-sm text-gray-700">{listing.rental_history}</p>
                </InfoCard>
              </>
            </ListSection>
          </ul>
        </ContentSection>
      </ListingAccordionItem>

      <ListingAccordionItem
        imageAlt="features-cards"
        imageSrc="/static/images/listing-features.svg"
        title="Features"
        subtitle="Amenities, unit details and additional fees"
        uuid="features"
      >
        <ContentSection>
          <dl>
            <Description term="Neighborhood" description={listing.neighborhood} />
            <Description term="Built" description={listing.year_built} />
            <Description term="Smoking Policy" description={listing.smoking_policy} />
            <Description term="Pets Policy" description={listing.pet_policy} />
            <Description term="Property Amenities" description={listing.amenities} />
          </dl>
        </ContentSection>
      </ListingAccordionItem>

      <ListingAccordionItem
        imageAlt="neighborhood-buildings"
        imageSrc="/static/images/listing-neighborhood.svg"
        title="Neighborhood"
        subtitle="Location and transportation"
        uuid="neighborhood"
      >
        <ContentSection>
          <p>Map goes here…</p>
        </ContentSection>
      </ListingAccordionItem>

      <ListingAccordionItem
        imageAlt="additional-information-envelope"
        imageSrc="/static/images/listing-legal.svg"
        title="Additional Information"
        subtitle="Required documents and selection criteria"
        uuid="additionalInformation"
      >
        <ContentSection>
          <InfoCard title="Required Documents">
            <p className="text-sm text-gray-700">{listing.required_documents}</p>
          </InfoCard>
        </ContentSection>
      </ListingAccordionItem>
    </Accordion>
  )
}

export default ListingAccordion
