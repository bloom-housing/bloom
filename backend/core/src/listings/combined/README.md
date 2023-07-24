This directory contains most of the code needed to combine local and external listings together into a single resultset for querying.

The need to import listings from other sites is expected to be temporary, so all code required for combining listings together is in this directory (to the extent possible), rather than following previously established organizational patterns, in order to make removal easier later. Notable exceptions include changes to `ListingsController` and `ListingsService`, as well as E2E tests in the test directory. Any code that is tied to combining local and external listings is tagged with `REMOVE_WHEN_EXTERNAL_NOT_NEEDED` comments. When listing imports are no longer necessary, just remove these files/classes/methods.

The basic idea is this:

1. Create a single table to hold external listings. For complex data structures (units, multiselect questions, etc), store these values into `jsonb` fields rather than having to manage duplicate tables for every type.
2. Use a view to union together the imported listings with the local listings. Note that the query that generates the local listings portion must perform joins across related data (units, etc) and combine them into json objects.
3. Query the view in place of the local listings table, applying filters as necessary.
4. Transform the queried data into `Listing` objects and return them through the API.

Querying against complex data like unit fields becomes a little bit more complex, but there is code in place already to translate filter params into query criteria in `combined-listing-query-builder.ts`. To add a new filter on _Listing_ properties, add it to `CombinedListingFilterKeys`. To add a new filter on _Unit_ properties, add it to the `CombinedListingUnitFilterKeys` enum. Once the field has been added to one of those, add it to the `CombinedListingFilterParams` class. If it was a unit field, you will also need to add it to the `unitSubqueryFields` variable in the `CombinedListingsQueryBuilder.addFilters` method so the subquery can know what type to cast it as. Once you've done this, everything else should just work.

It doesn't really matter how the listings are imported as long as they are in the expected format. Note however, that there is code under `tasks/import-listings` that will automatically import listings from a provided endpoint and load them into a specified database, so this method should be preferred.
