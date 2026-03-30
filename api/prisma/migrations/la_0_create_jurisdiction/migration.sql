-- conditionally create or update the LA jurisdiction
INSERT INTO jurisdictions (
  created_at,
  updated_at,
  name,
  notifications_sign_up_url,
  languages,
  minimum_listing_publish_images_required,
  public_url,
  email_from_address,
  rental_assistance_default,
  what_to_expect,
  what_to_expect_under_construction,
  enable_partner_settings,
  enable_partner_demographics,
  enable_geocoding_preferences,
  enable_geocoding_radius_method,
  allow_single_use_code_login,
  listing_approval_permission,
  duplicate_listing_permissions,
  required_listing_fields,
  partner_terms,
  what_to_expect_additional_text,
  visible_accessibility_priority_types,
  visible_neighborhood_amenities,
  visible_spoken_languages,
  regions,
  listing_features_configuration,
  race_ethnicity_configuration
) VALUES (
  now(),
  now(),
  'Los Angeles',
  NULL,
  ARRAY['en','es','zh','vi','tl','ko','hy','fa']::"languages_enum"[],
  3,
  'https://accesshousingla.org',
  'City of Los Angeles Housing Department <lahd.AcHP.DoNotReply@lacity.org>',
  'Housing Choice Vouchers, Section 8 and other valid rental assistance programs will be considered for this property. In the case of a valid rental subsidy, the required minimum income will be based on the portion of the rent that the tenant pays after use of the subsidy.',
  '<p>If you are interested in applying for this property, please get in touch in one of these ways:</p><ul><li><p>Phone</p></li><li><p>Email</p></li><li><p>In-person</p></li><li><p>In some instances, the property has a link directly to an application</p></li></ul><p>Once you contact a property, ask if they have any available units if you are looking to move in immediately.</p><p><strong>Waitlists</strong>:</p><p>If none are available, but you are still interested in eventually living at the property, ask how you can be placed on their waitlist.</p>',
  'This property is still under construction by the property owners. You can check back later to this page for updates.',
  true,
  false,
  false,
  false,
  false,
  ARRAY['admin']::"user_role_enum"[],
  ARRAY['admin','partner']::"user_role_enum"[],
  ARRAY['listingsBuildingAddress','name','listingImages','leasingAgentEmail','leasingAgentName','leasingAgentPhone','jurisdictions','units','digitalApplication','paperApplication','referralOpportunity','rentalAssistance','listingFileNumber','listingImages.description'],
  'I have reviewed the [Terms of Use](https://lahousing.lacity.org/AAHR/ComCon/Tab/RenderTab?tabName=Terms%20and%20Conditions) for this Website, as that term is defined in the Terms of Use, and agree to comply with all requirements described therein that relate to my use as a Professional Partner or Local Government. If I am agreeing to comply with the Terms of Use on behalf of a Professional Partner or Local Government, I warrant that I am authorized to enter into agreements such as the Terms of Use on behalf of such Professional Partner or Local Government.',
  '',
  ARRAY['mobility','hearingAndVision','mobilityHearingAndVision']::"unit_accessibility_priority_type_enum"[],
  ARRAY['groceryStores','pharmacies','shoppingVenues','hospitals','seniorCenters','recreationalFacilities','playgrounds','busStops']::"neighborhood_amenities_enum"[],
  ARRAY['chineseCantonese','chineseMandarin','english','filipino','korean','russian','spanish','vietnamese','farsi','afghani','notListed']::"spoken_language_enum"[],
  ARRAY['Antelope Valley','San Gabriel Valley','San Fernando Valley and Santa Clarita Valley','Metro Los Angeles','West Los Angeles','South Los Angeles','East Los Angeles','South Bay / Harbor'],
  '{
    "categories": [
      {
        "id": "mobility",
        "fields": [
          {"id": "accessibleParking"},
          {"id": "barrierFreePropertyEntrance"},
          {"id": "barrierFreeUnitEntrance"},
          {"id": "elevator"},
          {"id": "frontControlsDishwasher"},
          {"id": "frontControlsStoveCookTop"},
          {"id": "kitchenCounterLowered"},
          {"id": "leverHandlesOnDoors"},
          {"id": "loweredLightSwitch"},
          {"id": "mobility"},
          {"id": "noEntryStairs"},
          {"id": "noStairsToParkingSpots"},
          {"id": "noStairsWithinUnit"},
          {"id": "refrigeratorWithBottomDoorFreezer"},
          {"id": "streetLevelEntrance"},
          {"id": "wheelchairRamp"}
        ]
      },
      {
        "id": "bathroom",
        "fields": [
          {"id": "accessibleHeightToilet"},
          {"id": "barrierFreeBathroom"},
          {"id": "bathGrabBarsOrReinforcements"},
          {"id": "bathroomCounterLowered"},
          {"id": "rollInShower"},
          {"id": "toiletGrabBarsOrReinforcements"},
          {"id": "turningCircleInBathrooms"},
          {"id": "walkInShower"},
          {"id": "wideDoorways"}
        ]
      },
      {
        "id": "flooring",
        "fields": [
          {"id": "carpetInUnit"},
          {"id": "hardFlooringInUnit"}
        ],
        "required": true
      },
      {
        "id": "utility",
        "fields": [
          {"id": "acInUnit"},
          {"id": "fireSuppressionSprinklerSystem"},
          {"id": "heatingInUnit"},
          {"id": "inUnitWasherDryer"},
          {"id": "laundryInBuilding"},
          {"id": "leverHandlesOnFaucets"}
        ]
      },
      {
        "id": "hearingVision",
        "fields": [
          {"id": "brailleSignageInBuilding"},
          {"id": "carbonMonoxideDetectorWithStrobe"},
          {"id": "extraAudibleCarbonMonoxideDetector"},
          {"id": "extraAudibleSmokeDetector"},
          {"id": "hearingAndVision"},
          {"id": "nonDigitalKitchenAppliances"},
          {"id": "smokeDetectorWithStrobe"},
          {"id": "ttyAmplifiedPhone"}
        ]
      }
    ]
  }'::jsonb,
  '{
    "options": [
      {"id": "americanIndianAlaskanNative", "subOptions": [], "allowOtherText": false},
      {"id": "asian", "subOptions": [], "allowOtherText": false},
      {"id": "blackAfricanAmerican", "subOptions": [], "allowOtherText": false},
      {"id": "hispanicLatino", "subOptions": [], "allowOtherText": false},
      {"id": "middleEasternNorthAfrican", "subOptions": [], "allowOtherText": false},
      {"id": "nativeHawaiianOtherPacificIslander", "subOptions": [], "allowOtherText": false},
      {"id": "white", "subOptions": [], "allowOtherText": false},
      {"id": "otherMultiracial", "subOptions": [], "allowOtherText": true}
    ]
  }'::jsonb
)
ON CONFLICT (name) DO UPDATE SET
  updated_at                              = now(),
  notifications_sign_up_url              = EXCLUDED.notifications_sign_up_url,
  languages                              = EXCLUDED.languages,
  minimum_listing_publish_images_required = EXCLUDED.minimum_listing_publish_images_required,
  public_url                             = EXCLUDED.public_url,
  email_from_address                     = EXCLUDED.email_from_address,
  rental_assistance_default              = EXCLUDED.rental_assistance_default,
  what_to_expect                         = EXCLUDED.what_to_expect,
  what_to_expect_under_construction      = EXCLUDED.what_to_expect_under_construction,
  enable_partner_settings                = EXCLUDED.enable_partner_settings,
  enable_partner_demographics            = EXCLUDED.enable_partner_demographics,
  enable_geocoding_preferences           = EXCLUDED.enable_geocoding_preferences,
  enable_geocoding_radius_method         = EXCLUDED.enable_geocoding_radius_method,
  allow_single_use_code_login            = EXCLUDED.allow_single_use_code_login,
  listing_approval_permission            = EXCLUDED.listing_approval_permission,
  duplicate_listing_permissions          = EXCLUDED.duplicate_listing_permissions,
  required_listing_fields                = EXCLUDED.required_listing_fields,
  partner_terms                          = EXCLUDED.partner_terms,
  what_to_expect_additional_text         = EXCLUDED.what_to_expect_additional_text,
  visible_accessibility_priority_types   = EXCLUDED.visible_accessibility_priority_types,
  visible_neighborhood_amenities         = EXCLUDED.visible_neighborhood_amenities,
  visible_spoken_languages               = EXCLUDED.visible_spoken_languages,
  regions                                = EXCLUDED.regions,
  listing_features_configuration         = EXCLUDED.listing_features_configuration,
  race_ethnicity_configuration           = EXCLUDED.race_ethnicity_configuration
;

-- conditionally create reserved community types
INSERT INTO reserved_community_types (created_at, updated_at, description, jurisdiction_id, name)
SELECT now(), now(), NULL, j.id, rct_name
FROM jurisdictions j
CROSS JOIN unnest(ARRAY['senior55', 'senior62', 'referralOnly']::TEXT[]) AS rct_name
WHERE j.name = 'Los Angeles' AND NOT EXISTS (
  SELECT 1 FROM reserved_community_types rct
  WHERE rct.jurisdiction_id = j.id AND rct.name = rct_name
);

-- conditionally create unit types
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 0, 'studio'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'studio'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 1, 'oneBdrm'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'oneBdrm'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 2, 'twoBdrm'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'twoBdrm'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 3, 'threeBdrm'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'threeBdrm'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 4, 'fourBdrm'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'fourBdrm'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 0, 'SRO'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'SRO'
);
INSERT INTO unit_types (created_at, updated_at, num_bedrooms, name)
SELECT NOW(), NOW(), 5, 'fiveBdrm'
WHERE NOT EXISTS (
    SELECT 1
    FROM unit_types
    WHERE name = 'fiveBdrm'
);
