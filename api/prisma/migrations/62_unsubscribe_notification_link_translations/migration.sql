-- Replaces rentalOpportunity.footer.unsubscribeAndEmailSettings with two separate keys:
-- unsubscribeFromAll (one-click public unsubscribe link)
-- manageSubscriptions (sign-in link to manage notification preferences)
-- Only targets global translations (jurisdiction_id IS NULL).

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "Unsubscribe from all", "manageSubscriptions": "Manage subscriptions"}'::jsonb
)
WHERE language = 'en' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "Cancelar todas las suscripciones", "manageSubscriptions": "Gestionar suscripciones"}'::jsonb
)
WHERE language = 'es' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "Hủy đăng ký tất cả", "manageSubscriptions": "Quản lý đăng ký"}'::jsonb
)
WHERE language = 'vi' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "取消所有订阅", "manageSubscriptions": "管理订阅"}'::jsonb
)
WHERE language = 'zh' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "I-unsubscribe sa lahat", "manageSubscriptions": "Pamahalaan ang mga subscription"}'::jsonb
)
WHERE language = 'tl' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "সমস্ত থেকে আনসাবস্ক্রাইব করুন", "manageSubscriptions": "সাবস্ক্রিপশন পরিচালনা করুন"}'::jsonb
)
WHERE language = 'bn' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "إلغاء الاشتراك من الكل", "manageSubscriptions": "إدارة الاشتراكات"}'::jsonb
)
WHERE language = 'ar' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "모든 구독 취소", "manageSubscriptions": "구독 관리"}'::jsonb
)
WHERE language = 'ko' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "Դադարեցնել բոլոր բաժանորդագրությունները", "manageSubscriptions": "Կառավարել բաժանորդագրությունները"}'::jsonb
)
WHERE language = 'hy' AND jurisdiction_id IS NULL;

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) || '{"unsubscribeFromAll": "لغو اشتراک از همه", "manageSubscriptions": "مدیریت اشتراک‌ها"}'::jsonb
)
WHERE language = 'fa' AND jurisdiction_id IS NULL;

-- Remove the old combined key from all languages
UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity,footer}',
  (COALESCE(translations->'rentalOpportunity'->'footer', '{}'::jsonb) - 'unsubscribeAndEmailSettings')
)
WHERE jurisdiction_id IS NULL
  AND translations->'rentalOpportunity'->'footer' ? 'unsubscribeAndEmailSettings';
