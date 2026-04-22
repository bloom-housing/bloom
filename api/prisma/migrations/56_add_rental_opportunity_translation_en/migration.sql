-- Adds English copy for listing opportunity email notices.

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Rental opportunity at",
    "community": "Community",
    "applicationsDue": "Applications Due",
    "address": "Address",
    "rent": "Rent",
    "minIncome": "Minimum Income",
    "maxIncome": "Maximum Income",
    "lottery": "Lottery Date",
    "viewListingNotice": {
      "line1": "THIS INFORMATION MAY CHANGE",
      "line2": "Please view listing for the most updated information"
    },
    "viewButton": {
      "en": "View listing & apply"
    },
    "footer": {
      "accessibleMarketingFlyer": "Accessible marketing flyer",
      "unsubscribe": "Unsubscribe",
      "emailSettings": "Email settings"
    }
  }'::jsonb
)
WHERE language = 'en';
