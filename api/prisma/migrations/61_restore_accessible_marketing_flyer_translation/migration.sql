-- Restores keys dropped by migration 59's shallow JSONB merge.
-- Migration 59 used || at the rentalOpportunity level with objects for both
-- "footer" and "accessibilityType", replacing those nested objects entirely
-- rather than merging into them. This dropped accessibleMarketingFlyer from
-- footer and all accessibilityType subtypes except hearingAndVision.
-- Only targets global translations (jurisdiction_id IS NULL).

-- Restore footer.accessibleMarketingFlyer

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "Accessible marketing flyer"}'::jsonb
)
WHERE language = 'en' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "Volante de marketing accesible"}'::jsonb
)
WHERE language = 'es' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "Tờ rơi tiếp thị có thể truy cập"}'::jsonb
)
WHERE language = 'vi' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "无障碍营销传单"}'::jsonb
)
WHERE language = 'zh' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "Naa-access na flyer sa marketing"}'::jsonb
)
WHERE language = 'tl' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "অ্যাক্সেসযোগ্য মার্কেটিং ফ্লায়ার"}'::jsonb
)
WHERE language = 'bn' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "نشرة تسويقية ميسّرة"}'::jsonb
)
WHERE language = 'ar' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "접근 가능한 마케팅 전단지"}'::jsonb
)
WHERE language = 'ko' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "بروشور بازاریابی قابل دسترس"}'::jsonb
)
WHERE language = 'fa' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"accessibleMarketingFlyer": "Հասանելի մարքեթինգային թռուցիկ"}'::jsonb
)
WHERE language = 'hy' AND jurisdiction_id IS NULL;

-- Restore accessibilityType subtypes (hearing, mobility, vision,
-- mobilityAndHearing, mobilityAndVision, mobilityHearingAndVision).
-- hearingAndVision is intentionally excluded -- migration 59 updated its value.

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "Hearing",
    "mobility": "Mobility",
    "vision": "Vision",
    "mobilityAndHearing": "Mobility and Hearing",
    "mobilityAndVision": "Mobility and Vision",
    "mobilityHearingAndVision": "Mobility and Hearing/Vision"
  }'::jsonb
)
WHERE language = 'en' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "Auditiva",
    "mobility": "Movilidad",
    "vision": "Visual",
    "mobilityAndHearing": "Movilidad y auditiva",
    "mobilityAndVision": "Movilidad y visual",
    "mobilityHearingAndVision": "Movilidad y auditiva/visual"
  }'::jsonb
)
WHERE language = 'es' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "Thính giác",
    "mobility": "Di chuyển",
    "vision": "Thị giác",
    "mobilityAndHearing": "Di chuyển và thính giác",
    "mobilityAndVision": "Di chuyển và thị giác",
    "mobilityHearingAndVision": "Di chuyển và thính giác/thị giác"
  }'::jsonb
)
WHERE language = 'vi' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "听力",
    "mobility": "行动",
    "vision": "视力",
    "mobilityAndHearing": "行动和听力",
    "mobilityAndVision": "行动和视力",
    "mobilityHearingAndVision": "行动和听力/视力"
  }'::jsonb
)
WHERE language = 'zh' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "Pandinig",
    "mobility": "Mobilidad",
    "vision": "Paningin",
    "mobilityAndHearing": "Mobilidad at pandinig",
    "mobilityAndVision": "Mobilidad at paningin",
    "mobilityHearingAndVision": "Mobilidad at pandinig/paningin"
  }'::jsonb
)
WHERE language = 'tl' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "শ্রবণ",
    "mobility": "গতিশীলতা",
    "vision": "দৃষ্টি",
    "mobilityAndHearing": "গতিশীলতা ও শ্রবণ",
    "mobilityAndVision": "গতিশীলতা ও দৃষ্টি",
    "mobilityHearingAndVision": "গতিশীলতা এবং শ্রবণ/দৃষ্টি"
  }'::jsonb
)
WHERE language = 'bn' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "السمع",
    "mobility": "الحركة",
    "vision": "البصر",
    "mobilityAndHearing": "الحركة والسمع",
    "mobilityAndVision": "الحركة والبصر",
    "mobilityHearingAndVision": "الحركة والسمع/البصر"
  }'::jsonb
)
WHERE language = 'ar' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "청각",
    "mobility": "이동성",
    "vision": "시각",
    "mobilityAndHearing": "이동성 및 청각",
    "mobilityAndVision": "이동성 및 시각",
    "mobilityHearingAndVision": "이동성 및 청각/시각"
  }'::jsonb
)
WHERE language = 'ko' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "شنوایی",
    "mobility": "تحرک",
    "vision": "بینایی",
    "mobilityAndHearing": "تحرک و شنوایی",
    "mobilityAndVision": "تحرک و بینایی",
    "mobilityHearingAndVision": "تحرک و شنوایی/بینایی"
  }'::jsonb
)
WHERE language = 'fa' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,accessibilityType}',
  COALESCE(translations->'rentalOpportunity'->'accessibilityType', '{}'::jsonb) || '{
    "hearing": "Լսողություն",
    "mobility": "Շարժունակություն",
    "vision": "Տեսողություն",
    "mobilityAndHearing": "Շարժունակություն և լսողություն",
    "mobilityAndVision": "Շարժունակություն և տեսողություն",
    "mobilityHearingAndVision": "Շարժունակություն և լսողություն/տեսողություն"
  }'::jsonb
)
WHERE language = 'hy' AND jurisdiction_id IS NULL;

