import Layout from '../../layouts/application';
import { PropertyTitleImage } from '@dahlia/ui-components/src/cards/property_title_image';

const Listing = (props: any) => {
  const listing = props.listing

  return (
    <Layout>
      <article className="max-w-2xl m-auto mb-12">
        <div className="w-full p-3">
          <PropertyTitleImage title={listing.name} imageUrl={listing.image_url} listingId={listing.id} />
        </div>
      <h1>Listing Id: {listing.id}</h1>
      <p>This is the listing content.</p>
      </article>
    </Layout>
  );
}

Listing.getInitialProps = async function(context) {
  const { id } = context.query;
  let listing = {id: id, name: "The Triton", image_url: "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png"}

  return {
    listing: listing
  };
};

export default Listing;