import * as React from "react"

import ContentAccordion from "./ContentAccordion"
import { StandardTable } from "../../tables/StandardTable"

export default {
  title: "Listing/Accordion",
}

const barContent = () => {
  return <>Header Content</>
}
const expandedContent = () => {
  return <div>ExpandedContent</div>
}

export const blueThemeBasic = () => {
  return (
    <ContentAccordion
      customBarContent={barContent()}
      customExpandedContent={expandedContent()}
      accordionTheme={"blue"}
    />
  )
}

const headers = {
  name: "t.name",
  relationship: "t.relationship",
  dob: "application.household.member.dateOfBirth",
}

const data = [
  {
    name: "Jim Halpert",
    relationship: "Husband",
    dob: "05/01/1985",
  },
  {
    name: "Michael Scott",
    relationship: "Friend",
    dob: "05/01/1975",
  },
]

export const blueThemeFilled = () => {
  const customBarContent = () => {
    return (
      <h3 className={"toggle-header-content"}>
        <strong>{"Studio"}</strong>:&nbsp;
        {"41 units, 285 square feet, 2nd - 3rd floors"}
      </h3>
    )
  }
  const customExpandedContent = () => {
    return (
      <div>
        <StandardTable headers={headers} data={data} />
      </div>
    )
  }
  return (
    <ContentAccordion
      customBarContent={customBarContent()}
      customExpandedContent={customExpandedContent()}
      accordionTheme={"blue"}
    />
  )
}

export const grayThemeBasic = () => {
  return (
    <ContentAccordion
      customBarContent={barContent()}
      customExpandedContent={expandedContent()}
      accordionTheme={"gray"}
    />
  )
}

export const grayThemeFilled = () => {
  const customBarContent = () => {
    return (
      <span className={"flex w-full justify-between items-center"}>
        <span className={"flex items-center"}>
          <span className={"font-serif text-3xl font-medium leading-4 pr-2"}>1</span> person in
          household
        </span>
        <span className={"flex pr-4 items-center"}>
          <span className={"pr-1 text-gray-700"}>Income</span>
          <span>$4,090 to $9,325</span>
          <span className={"pl-1 text-gray-700"}>per month</span>
        </span>
      </span>
    )
  }
  const customExpandedContent = () => {
    return <div className={"border border-gray-400 border-t-0 p-4"}>Content</div>
  }
  return (
    <ContentAccordion
      customBarContent={customBarContent()}
      customExpandedContent={customExpandedContent()}
      accordionTheme={"gray"}
    />
  )
}

export const custom = () => {
  const expandedContent = () => {
    return <div className={"p-5 bg-gray-100 font-serif text-primary"}>Expanded Content</div>
  }
  const barContent = () => {
    return (
      <div className={"uppercase text-base font-sans font-semibold text-primary"}>
        Header Content
      </div>
    )
  }
  return (
    <ContentAccordion
      customBarContent={barContent()}
      customExpandedContent={expandedContent()}
      barClass={"p-5  bg-gray-400"}
    />
  )
}
