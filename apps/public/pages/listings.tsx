import * as React from 'react';
import Layout from '../layouts/application';
import { PageHeader } from '@dahlia/ui-components/src/header/page_header';
import { Listing, ListingsList } from '../components/listings_list';

const Listings = (props: any) => {

  return (
    <Layout>
      <PageHeader>Rent affordable housing</PageHeader>
      <ListingsList listings={props.listings} />
    </Layout>
  );
};

Listings.getInitialProps = async function() {
  // Messing around with different ways of adding in data
  let listings: Array<Listing> = []
  listings.push({id: 3, name: "The Triton", image_url: "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png"})
  listings.push({id: 6, name: "Second Listing"})
  let thirdListing = {id: 12, name: "Third Listing"}
  listings.push(thirdListing)

  return {
    listings: listings
  };
};

export default Listings;