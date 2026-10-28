ALTER TABLE "jurisdictions" ADD COLUMN     "listing_features_configuration" JSONB;

-- Set default flat list configuration for all existing jurisdictions
UPDATE "jurisdictions" 
SET "listing_features_configuration" = '{
  "fields": [
    {"id": "wheelchairRamp"},
    {"id": "elevator"},
    {"id": "serviceAnimalsAllowed"},
    {"id": "accessibleParking"},
    {"id": "parkingOnSite"},
    {"id": "inUnitWasherDryer"},
    {"id": "laundryInBuilding"},
    {"id": "barrierFreeEntrance"},
    {"id": "rollInShower"},
    {"id": "grabBars"},
    {"id": "heatingInUnit"},
    {"id": "acInUnit"},
    {"id": "hearing"},
    {"id": "mobility"},
    {"id": "visual"},
    {"id": "barrierFreeUnitEntrance"},
    {"id": "loweredLightSwitch"},
    {"id": "barrierFreeBathroom"},
    {"id": "wideDoorways"},
    {"id": "loweredCabinets"}
  ]
}'::jsonb;
