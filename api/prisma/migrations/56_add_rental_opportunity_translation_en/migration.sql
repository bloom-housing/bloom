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

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Oportunidad de alquiler en",
    "community": "Comunidad",
    "communityType": {
      "developmentalDisability": "La discapacidad del desarrollo",
      "farmworkerHousing": "Vivienda para trabajadores agrícolas",
      "housingVoucher": "Vale HCV/Sección 8",
      "referralOnly": "Sólo por referencia",
      "schoolEmployee": "Empleado de la escuela",
      "senior": "Personas mayores",
      "senior55": "Personas mayores de 55 años",
      "senior62": "Personas mayores de 62 años",
      "specialNeeds": "Necesidades especiales",
      "tay": "TAY - Jóvenes en edad de transición",
      "veteran": "Veterano"
    },
    "applicationsDue": "Fecha límite de solicitudes",
    "address": "Dirección",
    "neighborhood": "Vecindario",
    "unitType": "Tipo de unidad",
    "accessibilityType": {
      "hearing": "Auditiva",
      "mobility": "Movilidad",
      "vision": "Visual",
      "hearingAndVision": "Auditiva y visual",
      "mobilityAndHearing": "Movilidad y auditiva",
      "mobilityAndVision": "Movilidad y visual",
      "mobilityHearingAndVision": "Movilidad y auditiva/visual"
    },
    "opportunityType": "Tipo de oportunidad",
    "lottery": "Lotería",
    "waitlist": "Lista de espera",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "Estudio",
      "oneBdrm": "1 dormitorio",
      "twoBdrm": "2 dormitorios",
      "threeBdrm": "3 dormitorios",
      "fourBdrm": "4 dormitorios",
      "fiveBdrm": "5 dormitorios"
    },
    "unitCount": "%{smart_count} unidad |||| %{smart_count} unidades",
    "bathCount": "%{smart_count} baño |||| %{smart_count} baños",
    "rent": "Renta",
    "sqft": "pies²",
    "minIncome": "Ingreso mínimo",
    "maxIncome": "Ingreso máximo",
    "income": "%{income} por mes",
    "lotteryDate": "Fecha de lotería",
    "viewListingNotice": {
      "line1": "ESTA INFORMACIÓN PUEDE CAMBIAR",
      "line2": "Por favor, consulte el anuncio para obtener la información más actualizada"
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
      "accessibleMarketingFlyer": "Volante de marketing accesible",
      "unsubscribe": "Cancelar suscripción",
      "emailSettings": "Configuración de correo electrónico"
    }
  }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Cơ hội thuê nhà tại",
    "community": "Cộng đồng",
    "communityType": {
      "developmentalDisability": "Khuyết tật phát triển",
      "farmworkerHousing": "Nhà ở cho công nhân nông trại",
      "housingVoucher": "Phiếu HCV/Phần 8",
      "referralOnly": "Chỉ giới thiệu",
      "schoolEmployee": "Nhân viên trường học",
      "senior": "Người lớn tuổi",
      "senior55": "Người cao tuổi 55+",
      "senior62": "Người cao tuổi 62+",
      "specialNeeds": "Nhu cầu đặc biệt",
      "tay": "TAY - Thanh thiếu niên trong độ tuổi chuyển tiếp",
      "veteran": "Cựu chiến binh"
    },
    "applicationsDue": "Hạn nộp đơn",
    "address": "Địa chỉ",
    "neighborhood": "Khu phố",
    "unitType": "Loại căn hộ",
    "accessibilityType": {
      "hearing": "Thính giác",
      "mobility": "Di chuyển",
      "vision": "Thị giác",
      "hearingAndVision": "Thính giác và thị giác",
      "mobilityAndHearing": "Di chuyển và thính giác",
      "mobilityAndVision": "Di chuyển và thị giác",
      "mobilityHearingAndVision": "Di chuyển và thính giác/thị giác"
    },
    "opportunityType": "Loại cơ hội",
    "lottery": "Xổ số",
    "waitlist": "Danh sách chờ",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "Studio",
      "oneBdrm": "1 phòng ngủ",
      "twoBdrm": "2 phòng ngủ",
      "threeBdrm": "3 phòng ngủ",
      "fourBdrm": "4 phòng ngủ",
      "fiveBdrm": "5 phòng ngủ"
    },
    "unitCount": "%{smart_count} căn hộ |||| %{smart_count} căn hộ",
    "bathCount": "%{smart_count} phòng tắm |||| %{smart_count} phòng tắm",
    "rent": "Tiền thuê",
    "sqft": "feet²",
    "minIncome": "Thu nhập tối thiểu",
    "maxIncome": "Thu nhập tối đa",
    "income": "%{income} mỗi tháng",
    "lotteryDate": "Ngày xổ số",
    "viewListingNotice": {
      "line1": "THÔNG TIN NÀY CÓ THỂ THAY ĐỔI",
      "line2": "Vui lòng xem danh sách để biết thông tin cập nhật nhất"
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
      "accessibleMarketingFlyer": "Tờ rơi tiếp thị có thể truy cập",
      "unsubscribe": "Hủy đăng ký",
      "emailSettings": "Cài đặt email"
    }
}'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "租赁机会，地点：",
    "community": "社区",
    "communityType": {
      "developmentalDisability": "发育障碍",
      "farmworkerHousing": "移工住房",
      "housingVoucher": "HCV/第 8 节优惠券",
      "referralOnly": "仅限推荐人",
      "schoolEmployee": "學校員工",
      "senior": "老年人",
      "senior55": "55 岁以上的老年人",
      "senior62": "62 岁以上的老年人",
      "specialNeeds": "特殊需求",
      "tay": "TAY - 過渡年齡青年",
      "veteran": "老將"
    },
    "applicationsDue": "申请截止日期",
    "address": "地址",
    "neighborhood": "街区",
    "unitType": "单元类型",
    "accessibilityType": {
      "hearing": "听力",
      "mobility": "行动",
      "vision": "视力",
      "hearingAndVision": "听力和视力",
      "mobilityAndHearing": "行动和听力",
      "mobilityAndVision": "行动和视力",
      "mobilityHearingAndVision": "行动和听力/视力"
    },
    "opportunityType": "机会类型",
    "lottery": "抽签",
    "waitlist": "候补名单",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "开间",
      "oneBdrm": "1间卧室",
      "twoBdrm": "2间卧室",
      "threeBdrm": "3间卧室",
      "fourBdrm": "4间卧室",
      "fiveBdrm": "5间卧室"
    },
    "unitCount": "%{smart_count} 个单元 |||| %{smart_count} 个单元",
    "bathCount": "%{smart_count} 间浴室 |||| %{smart_count} 间浴室",
    "rent": "租金",
    "sqft": "平方英尺",
    "minIncome": "最低收入",
    "maxIncome": "最高收入",
    "income": "每月 %{income}",
    "lotteryDate": "抽签日期",
    "viewListingNotice": {
      "line1": "此信息可能会更改",
      "line2": "请查看列表以获取最新信息"
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
      "accessibleMarketingFlyer": "无障碍营销传单",
      "unsubscribe": "取消订阅",
      "emailSettings": "电子邮件设置"
    }
}'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Pagkakataon sa pag-upa sa",
    "community": "Komunidad",
    "communityType": {
      "developmentalDisability": "Kapansanan sa pag-unlad",
      "farmworkerHousing": "Pabahay ng manggagawang bukid",
      "housingVoucher": "Voucher ng HCV/Seksyon 8",
      "referralOnly": "Referral lamang",
      "schoolEmployee": "Empleyado ng paaralan",
      "senior": "Mga nakatatanda",
      "senior55": "Mga nakatatanda 55+",
      "senior62": "Mga nakatatanda 62+",
      "specialNeeds": "Espesyal na pangangailangan",
      "tay": "TAY - Transition aged youth",
      "veteran": "Beterano"
    },
    "applicationsDue": "Deadline ng Aplikasyon",
    "address": "Address",
    "neighborhood": "Kapitbahayan",
    "unitType": "Uri ng unit",
    "accessibilityType": {
      "hearing": "Pandinig",
      "mobility": "Mobilidad",
      "vision": "Paningin",
      "hearingAndVision": "Pandinig at paningin",
      "mobilityAndHearing": "Mobilidad at pandinig",
      "mobilityAndVision": "Mobilidad at paningin",
      "mobilityHearingAndVision": "Mobilidad at pandinig/paningin"
    },
    "opportunityType": "Uri ng pagkakataon",
    "lottery": "Lottery",
    "waitlist": "Listahan ng paghihintay",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "Studio",
      "oneBdrm": "1 silid-tulugan",
      "twoBdrm": "2 silid-tulugan",
      "threeBdrm": "3 silid-tulugan",
      "fourBdrm": "4 silid-tulugan",
      "fiveBdrm": "5 silid-tulugan"
    },
    "unitCount": "%{smart_count} unit |||| %{smart_count} mga unit",
    "bathCount": "%{smart_count} banyo |||| %{smart_count} mga banyo",
    "rent": "Upa",
    "sqft": "sq ft",
    "minIncome": "Pinakamababang Kita",
    "maxIncome": "Pinakamataas na Kita",
    "income": "%{income} bawat buwan",
    "lotteryDate": "Petsa ng Lottery",
    "viewListingNotice": {
      "line1": "ANG IMPORMASYONG ITO AY MAAARING MAGBAGO",
      "line2": "Pakitingnan ang listahan para sa pinaka-updated na impormasyon"
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
      "accessibleMarketingFlyer": "Naa-access na flyer sa marketing",
      "unsubscribe": "Mag-unsubscribe",
      "emailSettings": "Mga setting ng email"
    }
}'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "ভাড়ার সুযোগ:",
    "community": "কমিউনিটি",
    "communityType": {
      "developmentalDisability": "বিকাশগত অক্ষমতা",
      "farmworkerHousing": "কৃষি শ্রমিকদের আবাসন",
      "housingVoucher": "এইচসিভি/ধারা ৮ ভাউচার",
      "referralOnly": "শুধুমাত্র রেফারেল",
      "schoolEmployee": "স্কুল কর্মচারী",
      "senior": "সিনিয়র",
      "senior55": "প্রবীণ 55+",
      "senior62": "প্রবীণ 62+",
      "specialNeeds": "বিশেষ চাহিদাসম্পন্ন",
      "tay": "TAY - পরিবর্তনশীল বয়স্ক যুবক",
      "veteran": "প্রবীণ"
    },
    "applicationsDue": "আবেদনের শেষ তারিখ",
    "address": "ঠিকানা",
    "neighborhood": "এলাকা",
    "unitType": "ইউনিটের ধরন",
    "accessibilityType": {
      "hearing": "শ্রবণ",
      "mobility": "গতিশীলতা",
      "vision": "দৃষ্টি",
      "hearingAndVision": "শ্রবণ ও দৃষ্টি",
      "mobilityAndHearing": "গতিশীলতা ও শ্রবণ",
      "mobilityAndVision": "গতিশীলতা ও দৃষ্টি",
      "mobilityHearingAndVision": "গতিশীলতা এবং শ্রবণ/দৃষ্টি"
    },
    "opportunityType": "সুযোগের ধরন",
    "lottery": "লটারি",
    "waitlist": "অপেক্ষার তালিকা",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "স্টুডিও",
      "oneBdrm": "১ শোয়ার ঘর",
      "twoBdrm": "২ শোয়ার ঘর",
      "threeBdrm": "৩ শোয়ার ঘর",
      "fourBdrm": "৪ শোয়ার ঘর",
      "fiveBdrm": "৫ শোয়ার ঘর"
    },
    "unitCount": "%{smart_count}টি ইউনিট |||| %{smart_count}টি ইউনিট",
    "bathCount": "%{smart_count}টি বাথরুম |||| %{smart_count}টি বাথরুম",
    "rent": "ভাড়া",
    "sqft": "বর্গফুট",
    "minIncome": "সর্বনিম্ন আয়",
    "maxIncome": "সর্বোচ্চ আয়",
    "income": "মাসে %{income}",
    "lotteryDate": "লটারির তারিখ",
    "viewListingNotice": {
      "line1": "এই তথ্য পরিবর্তন হতে পারে",
      "line2": "সর্বশেষ তথ্যের জন্য অনুগ্রহ করে তালিকাটি দেখুন"
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
      "accessibleMarketingFlyer": "অ্যাক্সেসযোগ্য মার্কেটিং ফ্লায়ার",
      "unsubscribe": "আনসাবস্ক্রাইব",
      "emailSettings": "ইমেইল সেটিংস"
    }
}'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "فرصة إيجار في",
    "community": "المجتمع",
    "communityType": {
      "developmentalDisability": "الإعاقة النمائية",
      "farmworkerHousing": "سكن عمال المزارع",
      "housingVoucher": "قسيمة HCV/القسم 8",
      "referralOnly": "الإحالة فقط",
      "schoolEmployee": "موظف المدرسة",
      "senior": "كبار السن",
      "senior55": "لكبار السن فوق 55 سنة",
      "senior62": "لكبار السن فوق 62 سنة",
      "specialNeeds": "الاحتياجات الخاصة",
      "tay": "تاي - الشباب في مرحلة الانتقال",
      "veteran": "محارب قديم"
    },
    "applicationsDue": "تاريخ انتهاء الطلبات",
    "address": "العنوان",
    "neighborhood": "الحي",
    "unitType": "نوع الوحدة",
    "accessibilityType": {
      "hearing": "السمع",
      "mobility": "الحركة",
      "vision": "البصر",
      "hearingAndVision": "السمع والبصر",
      "mobilityAndHearing": "الحركة والسمع",
      "mobilityAndVision": "الحركة والبصر",
      "mobilityHearingAndVision": "الحركة والسمع/البصر"
    },
    "opportunityType": "نوع الفرصة",
    "lottery": "القرعة",
    "waitlist": "قائمة الانتظار",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "استوديو",
      "oneBdrm": "غرفة نوم واحدة",
      "twoBdrm": "غرفتا نوم",
      "threeBdrm": "3 غرف نوم",
      "fourBdrm": "4 غرف نوم",
      "fiveBdrm": "5 غرف نوم"
    },
    "unitCount": "%{smart_count} وحدة |||| %{smart_count} وحدات",
    "bathCount": "%{smart_count} حمام |||| %{smart_count} حمامات",
    "rent": "الإيجار",
    "sqft": "قدم مربع",
    "minIncome": "الحد الأدنى للدخل",
    "maxIncome": "الحد الأقصى للدخل",
    "income": "%{income} شهرياً",
    "lotteryDate": "تاريخ القرعة",
    "viewListingNotice": {
      "line1": "قد تتغير هذه المعلومات",
      "line2": "يرجى مراجعة الإعلان للحصول على أحدث المعلومات"
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
      "accessibleMarketingFlyer": "نشرة تسويقية ميسّرة",
      "unsubscribe": "إلغاء الاشتراك",
      "emailSettings": "إعدادات البريد الإلكتروني"
    }
}'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "임대 기회 위치:",
    "community": "커뮤니티",
    "communityType": {
      "developmentalDisability": "발달 장애",
      "farmworkerHousing": "농장 노동자 숙소",
      "housingVoucher": "HCV/섹션 8 바우처",
      "referralOnly": "추천 전용",
      "schoolEmployee": "학교 직원",
      "senior": "어른",
      "senior55": "55세 이상 시니어",
      "senior62": "62세 이상 시니어",
      "specialNeeds": "특별한 요구",
      "tay": "TAY - 전환기 청소년",
      "veteran": "재향 군인"
    },
    "applicationsDue": "신청 마감일",
    "address": "주소",
    "neighborhood": "동네",
    "unitType": "유닛 유형",
    "accessibilityType": {
      "hearing": "청각",
      "mobility": "이동성",
      "vision": "시각",
      "hearingAndVision": "청각 및 시각",
      "mobilityAndHearing": "이동성 및 청각",
      "mobilityAndVision": "이동성 및 시각",
      "mobilityHearingAndVision": "이동성 및 청각/시각"
    },
    "opportunityType": "기회 유형",
    "lottery": "추첨",
    "waitlist": "대기자 명단",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "스튜디오",
      "oneBdrm": "침실 1개",
      "twoBdrm": "침실 2개",
      "threeBdrm": "침실 3개",
      "fourBdrm": "침실 4개",
      "fiveBdrm": "침실 5개"
    },
    "unitCount": "%{smart_count}개 유닛 |||| %{smart_count}개 유닛",
    "bathCount": "%{smart_count}개 욕실 |||| %{smart_count}개 욕실",
    "rent": "임대료",
    "sqft": "평방피트",
    "minIncome": "최소 소득",
    "maxIncome": "최대 소득",
    "income": "월 %{income}",
    "lotteryDate": "추첨 날짜",
    "viewListingNotice": {
      "line1": "이 정보는 변경될 수 있습니다",
      "line2": "최신 정보는 목록을 확인하시기 바랍니다"
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
      "accessibleMarketingFlyer": "접근 가능한 마케팅 전단지",
      "unsubscribe": "구독 취소",
      "emailSettings": "이메일 설정"
    }
}'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "Վարձակալության հնարավորություն",
    "community": "Համայնք",
    "communityType": {
      "developmentalDisability": "Զարգացման հաշմանդամություն",
      "farmworkerHousing": "Գյուղատնտեսական աշխատողների բնակարան",
      "housingVoucher": "HCV/Բաժին 8-ի վաուչեր",
      "referralOnly": "Միայն ուղղորդում",
      "schoolEmployee": "Դպրոցի աշխատակից",
      "senior": "Ավագներ",
      "senior55": "55+ տարեկան տարեցներ",
      "senior62": "Ավագներ 62+",
      "specialNeeds": "Հատուկ կարիքներ",
      "tay": "TAY - Անցումային տարիքի երիտասարդություն",
      "veteran": "Վետերան"
    },
    "applicationsDue": "Դիմումների վերջնաժամկետ",
    "address": "Հասցե",
    "neighborhood": "Թաղամաս",
    "unitType": "Բնակարանի տեսակ",
    "accessibilityType": {
      "hearing": "Լսողություն",
      "mobility": "Շարժունակություն",
      "vision": "Տեսողություն",
      "hearingAndVision": "Լսողություն և տեսողություն",
      "mobilityAndHearing": "Շարժունակություն և լսողություն",
      "mobilityAndVision": "Շարժունակություն և տեսողություն",
      "mobilityHearingAndVision": "Շարժունակություն և լսողություն/տեսողություն"
    },
    "opportunityType": "Հնարավորության տեսակ",
    "lottery": "Վիճակախաղ",
    "waitlist": "Սպասման ցուցակ",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "Ստուդիո",
      "oneBdrm": "1 ննջասենյակ",
      "twoBdrm": "2 ննջասենյակ",
      "threeBdrm": "3 ննջասենյակ",
      "fourBdrm": "4 ննջասենյակ",
      "fiveBdrm": "5 ննջասենյակ"
    },
    "unitCount": "%{smart_count} բնակարան |||| %{smart_count} բնակարան",
    "bathCount": "%{smart_count} լոգարան |||| %{smart_count} լոգարան",
    "rent": "Վարձավճար",
    "sqft": "քառ. ֆուտ",
    "minIncome": "Նվազագույն եկամուտ",
    "maxIncome": "Առավելագույն եկամուտ",
    "income": "ամսական %{income}",
    "lotteryDate": "Վիճակախաղի ամսաթիվ",
    "viewListingNotice": {
      "line1": "ԱՅՍ ՏԵՂԵԿԱՏՎՈՒԹՅՈՒՆԸ ԿԱՐՈՂ Է ՓՈՓՈԽՎԵԼ",
      "line2": "Խնդրում ենք դիտել ցուցակը ամենաթարմ տեղեկատվության համար"
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
      "accessibleMarketingFlyer": "Հասանելի մարքեթինգային թռուցիկ",
      "unsubscribe": "Դուրս գալ բաժանորդագրությունից",
      "emailSettings": "Էլ. փոստի կարգավորումներ"
    }
}'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{rentalOpportunity}',
  COALESCE(translations->'rentalOpportunity', '{}'::jsonb) || '{
    "intro": "فرصت اجاره در",
    "community": "جامعه",
    "communityType": {
      "developmentalDisability": "ناتوانی رشدی",
      "farmworkerHousing": "مسکن کارگران مزرعه",
      "housingVoucher": "کوپن HCV/بخش ۸",
      "referralOnly": "فقط ارجاع",
      "schoolEmployee": "کارمند مدرسه",
      "senior": "سالمندان",
      "senior55": "سالمندان ۵۵ سال به بالا",
      "senior62": "سالمندان ۶۲+ سال",
      "specialNeeds": "نیازهای ویژه",
      "tay": "TAY - جوانان در سنین گذار",
      "veteran": "جانباز"
    },
    "applicationsDue": "مهلت ارسال درخواست",
    "address": "آدرس",
    "neighborhood": "محله",
    "unitType": "نوع واحد",
    "accessibilityType": {
      "hearing": "شنوایی",
      "mobility": "تحرک",
      "vision": "بینایی",
      "hearingAndVision": "شنوایی و بینایی",
      "mobilityAndHearing": "تحرک و شنوایی",
      "mobilityAndVision": "تحرک و بینایی",
      "mobilityHearingAndVision": "تحرک و شنوایی/بینایی"
    },
    "opportunityType": "نوع فرصت",
    "lottery": "قرعه‌کشی",
    "waitlist": "لیست انتظار",
    "unitTypes": {
      "SRO": "SRO",
      "studio": "استودیو",
      "oneBdrm": "۱ اتاق خواب",
      "twoBdrm": "۲ اتاق خواب",
      "threeBdrm": "۳ اتاق خواب",
      "fourBdrm": "۴ اتاق خواب",
      "fiveBdrm": "۵ اتاق خواب"
    },
    "unitCount": "%{smart_count} واحد |||| %{smart_count} واحد",
    "bathCount": "%{smart_count} حمام |||| %{smart_count} حمام",
    "rent": "اجاره",
    "sqft": "فوت مربع",
    "minIncome": "حداقل درآمد",
    "maxIncome": "حداکثر درآمد",
    "income": "%{income} در ماه",
    "lotteryDate": "تاریخ قرعه‌کشی",
    "viewListingNotice": {
      "line1": "این اطلاعات ممکن است تغییر کند",
      "line2": "لطفاً برای جدیدترین اطلاعات، آگهی را مشاهده کنید"
    },
    "footer": {
      "accessibleMarketingFlyer": "بروشور بازاریابی قابل دسترس",
      "unsubscribe": "لغو اشتراک",
      "emailSettings": "تنظیمات ایمیل"
    }
}'::jsonb
)
WHERE language = 'fa';

