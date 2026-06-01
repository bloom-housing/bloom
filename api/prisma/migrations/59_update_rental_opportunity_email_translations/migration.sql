-- Adds additional fields for rental opportunity translations

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
    COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "footer": {
      "unsubscribeAndEmailSettings": "Unsubscribe and manage email settings"
    }}'::jsonb

)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "Cancelar suscripción y gestionar configuración de correo electrónico"
  }}'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "Hủy đăng ký và quản lý cài đặt email"
  }
}'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "footer": {
      "unsubscribeAndEmailSettings": "取消订阅并管理电子邮件设置"
    }
}'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "Mag-unsubscribe at pamahalaan ang mga settings ng email"
  }
  }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "আনসাবস্ক্রাইব করুন এবং ইমেইল সেটিংস পরিচালনা করুন"
  }
  }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "إلغاء الاشتراك وإدارة إعدادات البريد الإلكتروني"
  }
  }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "구독 취소 및 이메일 설정 관리"
  }
  }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "Դադարեցնել բաժանորդագրությունը և կառավարել էլ. փոստի կարգավորումները"
  }
  }'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
  "footer": {
    "unsubscribeAndEmailSettings": "لغو اشتراک و مدیریت تنظیمات ایمیل"
  }
  }'::jsonb
)
WHERE language = 'fa';
