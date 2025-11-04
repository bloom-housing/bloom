-- CreateEnum
CREATE TYPE "neighborhood_amenities_enum" AS ENUM ('groceryStores', 'publicTransportation', 'schools', 'parksAndCommunityCenters', 'pharmacies', 'healthCareResources');

-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "visible_neighborhood_amenities" "neighborhood_amenities_enum"[] DEFAULT ARRAY['groceryStores', 'publicTransportation', 'schools', 'parksAndCommunityCenters', 'pharmacies', 'healthCareResources']::"neighborhood_amenities_enum"[];
