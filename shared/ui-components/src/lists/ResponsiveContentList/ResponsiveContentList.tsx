import * as React from "react"
import { Desktop, Mobile } from "../../responsive/ResponsiveWrappers"
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion"

export interface ResponsiveContentProps {
  children: React.ReactNode
  desktopClass?: string
}

const ResponsiveContentList = (props: ResponsiveContentProps) => (
  <>
    <Mobile>
      <Accordion allowZeroExpanded allowMultipleExpanded>
        {props.children}
      </Accordion>
    </Mobile>
    <Desktop>
      <ul className="responsive-content-list">{props.children}</ul>
    </Desktop>
  </>
)

const ResponsiveContentItem = (props: ResponsiveContentProps) => (
  <>
    <Mobile>
      <AccordionItem>{props.children}</AccordionItem>
    </Mobile>
    <Desktop>
      <li className={"responsive-content-item " + (props.desktopClass ? props.desktopClass : "")}>
        {props.children}
      </li>
    </Desktop>
  </>
)

const ResponsiveContentItemHeader = (props: ResponsiveContentProps) => (
  <>
    <Mobile>
      <AccordionItemHeading aria-level={2}>
        <AccordionItemButton>{props.children}</AccordionItemButton>
      </AccordionItemHeading>
    </Mobile>
    <Desktop>{props.children}</Desktop>
  </>
)

const ResponsiveContentItemBody = (props: ResponsiveContentProps) => (
  <>
    <Mobile>
      <AccordionItemPanel>{props.children}</AccordionItemPanel>
    </Mobile>
    <Desktop>{props.children}</Desktop>
  </>
)

export {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody,
}
