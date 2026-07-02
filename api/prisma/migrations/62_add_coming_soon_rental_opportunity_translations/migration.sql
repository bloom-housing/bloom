-- Adds coming soon (pre-marketing) rental opportunity translations

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "Applications Open",
  "comingSoon": {
    "subject": "Coming soon - %{listingName}",
    "intro": "Coming soon"
  }}'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "Apertura de solicitudes",
  "comingSoon": {
    "subject": "Próximamente - %{listingName}",
    "intro": "Próximamente"
  }}'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "Ngày bắt đầu nhận đơn",
  "comingSoon": {
    "subject": "Sắp ra mắt - %{listingName}",
    "intro": "Sắp ra mắt"
  }}'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "申请开放日期",
  "comingSoon": {
    "subject": "即将推出 - %{listingName}",
    "intro": "即将推出"
  }}'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "Pagbubukas ng Aplikasyon",
  "comingSoon": {
    "subject": "Malapit na - %{listingName}",
    "intro": "Malapit na"
  }}'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "আবেদন শুরুর তারিখ",
  "comingSoon": {
    "subject": "শীঘ্রই আসছে - %{listingName}",
    "intro": "শীঘ্রই আসছে"
  }}'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "تاريخ فتح الطلبات",
  "comingSoon": {
    "subject": "قريباً - %{listingName}",
    "intro": "قريباً"
  }}'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "신청 시작일",
  "comingSoon": {
    "subject": "곧 공개 예정 - %{listingName}",
    "intro": "곧 공개 예정"
  }}'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "Դիմումների մեկնարկի ամսաթիվ",
  "comingSoon": {
    "subject": "Շուտով - %{listingName}",
    "intro": "Շուտով"
  }}'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "applicationsOpen": "تاریخ شروع درخواست‌ها",
  "comingSoon": {
    "subject": "به زودی - %{listingName}",
    "intro": "به زودی"
  }}'::jsonb
)
WHERE language = 'fa';
