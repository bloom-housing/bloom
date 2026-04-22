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
      "en": "View listing & apply",
      "es": "Ver listado y aplicar",
      "zh": "查看列表并申请",
      "vi": "Xem danh sách và áp dụng",
      "tl": "Tingnan ang listahan at mag-apply",
      "bn": "তালিকা দেখুন এবং আবেদন করুন",
      "ar": "عرض القائمة والتقديم",
      "fa": "مشاهده لیست و اعمال",
      "hy": "Դիտեք ցուցակը և կիրառեք",
      "ko": "목록 보기 및 신청"
    },
    "footer": {
      "accessibleMarketingFlyer": "Accessible marketing flyer",
      "unsubscribe": "Unsubscribe",
      "emailSettings": "Email settings"
    }
  }'::jsonb
)
WHERE language = 'en';
