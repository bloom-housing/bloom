-- Adds English copy for listing opportunity email notices.

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Rental opportunity at",
    "community": "Community",
    "communityType": {
      "developmentalDisability": "Developmental disability",
      "farmworkerHousing": "Farmworker housing",
      "housingVoucher": "HCV/Section 8 Voucher",
      "referralOnly": "Referral only",
      "schoolEmployee": "School employee",
      "senior": "Seniors",
      "senior55": "Seniors 55+",
      "senior62": "Seniors 62+",
      "specialNeeds": "Special needs",
      "tay": "TAY - Transition aged youth",
      "veteran": "Veteran"
    },
    "applicationsDue": "Applications Due",
    "address": "Address",
    "neighborhood": "Neighborhood",
    "unitType": "Unit type",
    "accessibilityType": {
      "hearing": "Hearing",
      "mobility": "Mobility",
      "vision": "Vision",
      "hearingAndVision": "Hearing and Vision",
      "mobilityAndHearing": "Mobility and Hearing",
      "mobilityAndVision": "Mobility and Vision",
      "mobilityHearingAndVision": "Mobility and Hearing/Vision"
    },
    "opportunityType": "Opportunity type",
    "lottery": "Lottery",
    "waitlist": "Waitlist",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "Studio",
      "oneBdrm": "1 bedroom",
      "twoBdrm": "2 bedroom",
      "threeBdrm": "3 bedroom",
      "fourBdrm": "4 bedroom",
      "fiveBdrm": "5 bedroom"
    },
    "unitCount": "%{smart_count} unit |||| %{smart_count} units",
    "bathCount": "%{smart_count} bath |||| %{smart_count} baths",
    "rent": "Rent",
    "sqft": "sqft",
    "minIncome": "Minimum Income",
    "maxIncome": "Maximum Income",
    "income": "%{income} per month",
    "lotteryDate": "Lottery Date",
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
