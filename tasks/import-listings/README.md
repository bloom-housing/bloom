# Listings Import Task

**This version is only intended to provide basic documentation**  
**Future updates will expand on this**

## Environment Variables

| Name                       | Description                                                       | Example                                         | Default        | Type                   |
| -------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- | -------------- | ---------------------- |
| DATABASE_URL               | The URI for the database to import listings into                  | postgres://bloom-dev:bloom@localhost:5432/bloom |                | string                 |
| EXTERNAL_API_BASE          | The URL base (proto + host) for the backend to pull listings from | https://api.bloom.example                       |                | string                 |
| LISTINGS_ENDPOINT_PATH     | The path to the listings endpoint                                 | /listings                                       | /listings      | string                 |
| JURISDICTION_ENDPOINT_PATH | The path to the jurisdictions endpoint                            | /jurisdictions                                  | /jurisdictions | string                 |
| JURISDICTION_INCLUDE_LIST  | The names of jurisdictions to import listings from                | San Jose,San Mateo,Alameda                      |                | comma-delimited string |
| LISTING_VIEW               | The listing view to request from the endpoint                     | base                                            | base           | "base" \| "full"       |

## Example Import Command

```
DATABASE_URL=postgres://bloom-dev:bloom@localhost:5432/bloom \
EXTERNAL_API_BASE=https://api.housingbayarea.bloom.exygy.dev \
JURISDICTION_INCLUDE_LIST="San Jose,San Mateo,Alameda" \
LISTING_VIEW=full \
yarn import:run
```
