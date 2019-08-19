import * as React from "react"
import {
  AccordionItemState,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from "react-accessible-accordion"

interface ListingAccordionItemProps {
  children: React.ReactNode
  imageAlt: string
  imageSrc: string
  subtitle: string
  title: string
  uuid: string
}

const ListingAccordionItem = (props: ListingAccordionItemProps) => {
  return (
    <AccordionItem uuid={props.uuid}>
      <AccordionItemState>
        {({ expanded }) => (
          <>
            <AccordionItemHeading aria-level={3}>
              <AccordionItemButton>
                <header className="text-blue-800 sm:text-sm pr-4 pb-8 pl-4 pt-0">
                  <img alt={props.imageAlt} className="float-left w-12 mr-2" src={props.imageSrc} />
                  <img
                    src={`/static/images/cheveron-${expanded ? "up" : "down"}.svg`}
                    className="sm:hidden w-5 float-right"
                  />
                  <h3 className="md:text-black font-sans uppercase md:normal-case md:font-serif  md:text-2xl">
                    {props.title}
                  </h3>
                  <span className="md:text-gray-700">{props.subtitle}</span>
                </header>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>{props.children}</AccordionItemPanel>
          </>
        )}
      </AccordionItemState>
    </AccordionItem>
  )
}

export default ListingAccordionItem
