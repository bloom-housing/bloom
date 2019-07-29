import * as React from 'react';
import { PropertyTitleImage } from '@dahlia/ui-components/src/cards/property_title_image';
import Link from 'next/link';

export interface Listing {
  id: number;
  name: string;
  image_url?: string;
}

export interface ListingsProps {
  listings: Array<Listing>;
}

const buttonClasses = [
  'border',
  'border-primary',
  'px-8',
  'py-4',
  'text-lg',
  'uppercase',
  't-alt-sans',
  'inline-block'
]

export const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map(listing =>
    <article key={listing.id} className="flex flex-row flex-wrap max-w-5xl m-auto mb-12">
      <div className="w-full md:w-6/12 p-3">
        <PropertyTitleImage title={listing.name} imageUrl={listing.image_url} listingId={listing.id} />
      </div>
      <div className="w-full md:w-6/12 p-3">
        <Link href="listing/[id]" as={`/listing/${listing.id}`}>
          <a className={buttonClasses.join(' ')}>See Details</a>
        </Link>
      </div>
    </article>
  )

  return (
    <>{listItems}</>
  )
}
