-- AlterTable
ALTER TABLE "jurisdictions" ADD COLUMN     "race_ethnicity_configuration" JSONB;

-- Set default race/ethnicity configuration for existing jurisdictions
UPDATE "jurisdictions"
SET "race_ethnicity_configuration" = '{
  "options": [
    {
      "id": "americanIndianAlaskanNative",
      "subOptions": [],
      "allowOtherText": false
    },
    {
      "id": "asian",
      "subOptions": [
        {"id": "asianIndian", "allowOtherText": false},
        {"id": "chinese", "allowOtherText": false},
        {"id": "filipino", "allowOtherText": false},
        {"id": "japanese", "allowOtherText": false},
        {"id": "korean", "allowOtherText": false},
        {"id": "vietnamese", "allowOtherText": false},
        {"id": "otherAsian", "allowOtherText": true}
      ],
      "allowOtherText": false
    },
    {
      "id": "blackAfricanAmerican",
      "subOptions": [],
      "allowOtherText": false
    },
    {
      "id": "nativeHawaiianOtherPacificIslander",
      "subOptions": [
        {"id": "nativeHawaiian", "allowOtherText": false},
        {"id": "guamanianOrChamorro", "allowOtherText": false},
        {"id": "samoan", "allowOtherText": false},
        {"id": "otherPacificIslander", "allowOtherText": true}
      ],
      "allowOtherText": false
    },
    {
      "id": "white",
      "subOptions": [],
      "allowOtherText": false
    },
    {
      "id": "otherMultiracial",
      "subOptions": [],
      "allowOtherText": true
    },
    {
      "id": "declineToRespond",
      "subOptions": [],
      "allowOtherText": false
    }
  ]
}'
WHERE "race_ethnicity_configuration" IS NULL;