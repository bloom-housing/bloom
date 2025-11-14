-- AlterEnum
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'shoppingVenues';
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'hospitals';
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'seniorCenters';
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'recreationalFacilities';
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'playgrounds';
ALTER TYPE "neighborhood_amenities_enum" ADD VALUE 'busStops';

-- AlterTable
ALTER TABLE "listing_neighborhood_amenities" ADD COLUMN     "bus_stops" TEXT,
ADD COLUMN     "hospitals" TEXT,
ADD COLUMN     "playgrounds" TEXT,
ADD COLUMN     "recreational_facilities" TEXT,
ADD COLUMN     "senior_centers" TEXT,
ADD COLUMN     "shopping_venues" TEXT;
