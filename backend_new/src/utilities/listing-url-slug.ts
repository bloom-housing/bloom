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

export function listingUrlSlugHelper(input: string): string {
  return (
    (input || '').match(
      /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g,
    ) || []
  )
    .join('_')
    .toLowerCase();
}
