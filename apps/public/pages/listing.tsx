import { Component } from 'react';
import Layout from '../layouts/application';
import { Listing } from '../components/listings_list';
import { PropertyTitleImage } from '@dahlia/ui-components/src/cards/property_title_image';

import axios from 'axios';

interface ListingProps {
  listing: Listing
}

export default class extends Component<ListingProps> {
  static async getInitialProps ({ query }) {
    const listing_id = query.id;
    let listing = {};

    try {
      const response = await axios.get('http://localhost:3001');
      listing = response.data.listings.find(l => l.id == listing_id);
    } catch(error) {
      console.log(error);
    }

    return { listing }
  }

  render () {
    return (
      <Layout>
      <article className="max-w-2xl m-auto mb-12">
        <div className="w-full p-3">
          <PropertyTitleImage title={this.props.listing.name} imageUrl={this.props.listing.image_url} listingId={this.props.listing.id} />
        </div>
      <h1>Listing Id: {this.props.listing.id}</h1>
      <p>This is the listing content.</p>
      </article>
    </Layout>

    )
  }
}
