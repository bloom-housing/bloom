import Listing from '../dtos/listings/listing.dto';

/*
    This maps a listing to its url slug
    This is used by the public site front end
  */
export function listingUrlSlug(listing: Listing): string {
  const { name, listingsBuildingAddress } = listing;
  if (!listingsBuildingAddress) {
    return listingUrlSlugHelper(name);
  }
  return listingUrlSlugHelper(
    [
      name,
      listingsBuildingAddress.street,
      listingsBuildingAddress.city,
      listingsBuildingAddress.state,
    ].join(' '),
  );
}

/*
  This creates a string "_" separated at every upper case letter then lower cased
  This also removes special characters
  e.g. "ExampLe namE @ 17 11th Street Phoenix Az" -> "examp_le_nam_e_17_11_th_street_phoenix_az"
*/
export function listingUrlSlugHelper(input: string): string {
  return (
    (input || '').match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g,
    ) || []
  )
    .join('_')
    .toLowerCase();
}
