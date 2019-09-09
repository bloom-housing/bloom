import * as React from "react"

export interface ListingDetailHeaderProps {
  imageAlt: string
  imageSrc: string
  subtitle: string
  title: string
  children?: React.ReactNode
}

const ListingDetailHeader = (props: ListingDetailHeaderProps) => (
  <header className="text-blue-800 sm:text-sm pr-4 pb-8 pl-4 pt-0">
    <img alt={props.imageAlt} className="float-left w-12 mr-2" src={props.imageSrc} />
    <h2 className="md:text-black font-sans uppercase md:normal-case md:font-serif  md:text-2xl">
      {props.title}
    </h2>
    <span className="md:text-gray-700">{props.subtitle}</span>
  </header>
)

export default ListingDetailHeader
