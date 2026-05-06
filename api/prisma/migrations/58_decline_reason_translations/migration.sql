-- en
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Your application decline reason is %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"Age Restriction"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"Income Restriction"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"Unit Restriction (e.g. bedroom count and/or occupancy)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"Program Restriction (e.g. CES unit, Veteran Unit, VASH unit, etc.)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"Attempted to Contact; No Response"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"Household does not need accessible unit features"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"Other"'::jsonb, true)
  WHERE language = 'en' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'en',
  '{"applicationUpdate":{"declineReasonChange":"Your application decline reason is %{value}","declineReason":{"ageRestriction":"Age Restriction","incomeRestriction":"Income Restriction","unitRestriction":"Unit Restriction (e.g. bedroom count and/or occupancy)","programRestriction":"Program Restriction (e.g. CES unit, Veteran Unit, VASH unit, etc.)","attemptedToContactNoResponse":"Attempted to Contact; No Response","householdDoesNotNeedAccessibleUnit":"Household does not need accessible unit features","other":"Other"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- es
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"El motivo del rechazo de su solicitud es %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"Restricción de edad"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"Restricción de ingresos"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"Restricción de la unidad (por ejemplo, número de habitaciones y/o capacidad de ocupación)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"Restricción del programa (por ejemplo, unidad CES, unidad de veteranos, unidad VASH, etc.)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"Se intentó contactar; no hubo respuesta."'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"El hogar no necesita características de accesibilidad en la unidad."'::jsonb, true), '{applicationUpdate,declineReason,other}', '"Otro"'::jsonb, true)
  WHERE language = 'es' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'es',
  '{"applicationUpdate":{"declineReasonChange":"El motivo del rechazo de su solicitud es %{value}","declineReason":{"ageRestriction":"Restricción de edad","incomeRestriction":"Restricción de ingresos","unitRestriction":"Restricción de la unidad (por ejemplo, número de habitaciones y/o capacidad de ocupación)","programRestriction":"Restricción del programa (por ejemplo, unidad CES, unidad de veteranos, unidad VASH, etc.)","attemptedToContactNoResponse":"Se intentó contactar; no hubo respuesta.","householdDoesNotNeedAccessibleUnit":"El hogar no necesita características de accesibilidad en la unidad.","other":"Otro"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- tl
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Ang dahilan ng pagtanggi sa iyong aplikasyon ay %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"Paghihigpit sa Edad"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"Restriksyon sa Kita"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"Paghihigpit sa Yunit (hal. bilang ng kwarto at/o okupasyon)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"Paghihigpit sa Programa (hal. yunit ng CES, Yunit ng Beterano, yunit ng VASH, atbp.)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"Sinubukan kong kontakin; walang tugon"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"Hindi kailangan ng sambahayan ang mga accessible unit features"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"Iba pa"'::jsonb, true)
  WHERE language = 'tl' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'tl',
  '{"applicationUpdate":{"declineReasonChange":"Ang dahilan ng pagtanggi sa iyong aplikasyon ay %{value}","declineReason":{"ageRestriction":"Paghihigpit sa Edad","incomeRestriction":"Restriksyon sa Kita","unitRestriction":"Paghihigpit sa Yunit (hal. bilang ng kwarto at/o okupasyon)","programRestriction":"Paghihigpit sa Programa (hal. yunit ng CES, Yunit ng Beterano, yunit ng VASH, atbp.)","attemptedToContactNoResponse":"Sinubukan kong kontakin; walang tugon","householdDoesNotNeedAccessibleUnit":"Hindi kailangan ng sambahayan ang mga accessible unit features","other":"Iba pa"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- vi
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Lý do từ chối đơn đăng ký của bạn là %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"Giới hạn độ tuổi"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"Hạn chế thu nhập"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"Hạn chế của căn hộ (ví dụ: số lượng phòng ngủ và/hoặc sức chứa)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"Hạn chế của chương trình (ví dụ: đơn vị CES, đơn vị cựu chiến binh, đơn vị VASH, v.v.)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"Đã cố gắng liên lạc; Không nhận được phản hồi"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"Hộ gia đình không cần các tiện nghi dành cho người khuyết tật."'::jsonb, true), '{applicationUpdate,declineReason,other}', '"Khác"'::jsonb, true)
  WHERE language = 'vi' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'vi',
  '{"applicationUpdate":{"declineReasonChange":"Lý do từ chối đơn đăng ký của bạn là %{value}","declineReason":{"ageRestriction":"Giới hạn độ tuổi","incomeRestriction":"Hạn chế thu nhập","unitRestriction":"Hạn chế của căn hộ (ví dụ: số lượng phòng ngủ và/hoặc sức chứa)","programRestriction":"Hạn chế của chương trình (ví dụ: đơn vị CES, đơn vị cựu chiến binh, đơn vị VASH, v.v.)","attemptedToContactNoResponse":"Đã cố gắng liên lạc; Không nhận được phản hồi","householdDoesNotNeedAccessibleUnit":"Hộ gia đình không cần các tiện nghi dành cho người khuyết tật.","other":"Khác"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- zh
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"您的申请被拒原因是 %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"年龄限制"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"收入限制"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"单元限制（例如卧室数量和/或入住人数）"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"项目限制（例如 CES 单位、退伍军人单位、VASH 单位等）"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"尝试联系，但未收到回复"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"家庭不需要无障碍单元功能"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"其他"'::jsonb, true)
  WHERE language = 'zh' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'zh',
  '{"applicationUpdate":{"declineReasonChange":"您的申请被拒原因是 %{value}","declineReason":{"ageRestriction":"年龄限制","incomeRestriction":"收入限制","unitRestriction":"单元限制（例如卧室数量和/或入住人数）","programRestriction":"项目限制（例如 CES 单位、退伍军人单位、VASH 单位等）","attemptedToContactNoResponse":"尝试联系，但未收到回复","householdDoesNotNeedAccessibleUnit":"家庭不需要无障碍单元功能","other":"其他"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- ar
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"سبب رفض طلبك هو %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"قيود العمر"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"قيود الدخل"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"قيود الوحدة (مثل عدد غرف النوم و/أو الإشغال)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"قيود البرنامج (مثل وحدة CES، وحدة المحاربين القدامى، وحدة VASH، إلخ)."'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"محاولة الاتصال؛ لم يتم الرد"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"لا يحتاج المنزل إلى ميزات وحدة يسهل الوصول إليها"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"آخر"'::jsonb, true)
  WHERE language = 'ar' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'ar',
  '{"applicationUpdate":{"declineReasonChange":"سبب رفض طلبك هو %{value}","declineReason":{"ageRestriction":"قيود العمر","incomeRestriction":"قيود الدخل","unitRestriction":"قيود الوحدة (مثل عدد غرف النوم و/أو الإشغال)","programRestriction":"قيود البرنامج (مثل وحدة CES، وحدة المحاربين القدامى، وحدة VASH، إلخ).","attemptedToContactNoResponse":"محاولة الاتصال؛ لم يتم الرد","householdDoesNotNeedAccessibleUnit":"لا يحتاج المنزل إلى ميزات وحدة يسهل الوصول إليها","other":"آخر"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- bn
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"আপনার আবেদন প্রত্যাখ্যানের কারণ হল %{value}"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"বয়সসীমা"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"আয়ের সীমাবদ্ধতা"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"ইউনিটের সীমাবদ্ধতা (যেমন শয়নকক্ষের সংখ্যা এবং/অথবা বাসিন্দার সংখ্যা)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"প্রোগ্রামের সীমাবদ্ধতা (যেমন সিইএস ইউনিট, ভেটেরান ইউনিট, ভ্যাশ ইউনিট, ইত্যাদি)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"যোগাযোগের চেষ্টা করা হয়েছিল; কোনো সাড়া পাওয়া যায়নি।"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"পরিবারের জন্য প্রবেশযোগ্য ইউনিটের বৈশিষ্ট্যের প্রয়োজন নেই।"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"অন্যান্য"'::jsonb, true)
  WHERE language = 'bn' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'bn',
  '{"applicationUpdate":{"declineReasonChange":"আপনার আবেদন প্রত্যাখ্যানের কারণ হল %{value}","declineReason":{"ageRestriction":"বয়সসীমা","incomeRestriction":"আয়ের সীমাবদ্ধতা","unitRestriction":"ইউনিটের সীমাবদ্ধতা (যেমন শয়নকক্ষের সংখ্যা এবং/অথবা বাসিন্দার সংখ্যা)","programRestriction":"প্রোগ্রামের সীমাবদ্ধতা (যেমন সিইএস ইউনিট, ভেটেরান ইউনিট, ভ্যাশ ইউনিট, ইত্যাদি)","attemptedToContactNoResponse":"যোগাযোগের চেষ্টা করা হয়েছিল; কোনো সাড়া পাওয়া যায়নি।","householdDoesNotNeedAccessibleUnit":"পরিবারের জন্য প্রবেশযোগ্য ইউনিটের বৈশিষ্ট্যের প্রয়োজন নেই।","other":"অন্যান্য"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- ko
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"귀하의 지원서가 거절된 이유는 %{value}입니다."'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"연령 제한"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"소득 제한"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"숙소 제한 사항 (예: 침실 개수 및/또는 거주 인원)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"프로그램 제한 사항 (예: CES 부대, 재향군인 부대, VASH 부대 등)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"연락을 시도했으나 응답이 없었습니다."'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"해당 가구는 장애인 편의시설이 필요한 주택이 아닙니다."'::jsonb, true), '{applicationUpdate,declineReason,other}', '"다른"'::jsonb, true)
  WHERE language = 'ko' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'ko',
  '{"applicationUpdate":{"declineReasonChange":"귀하의 지원서가 거절된 이유는 %{value}입니다.","declineReason":{"ageRestriction":"연령 제한","incomeRestriction":"소득 제한","unitRestriction":"숙소 제한 사항 (예: 침실 개수 및/또는 거주 인원)","programRestriction":"프로그램 제한 사항 (예: CES 부대, 재향군인 부대, VASH 부대 등)","attemptedToContactNoResponse":"연락을 시도했으나 응답이 없었습니다.","householdDoesNotNeedAccessibleUnit":"해당 가구는 장애인 편의시설이 필요한 주택이 아닙니다.","other":"다른"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- hy
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Ձեր դիմումի մերժման պատճառը %{value} է"'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"Տարիքային սահմանափակում"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"Եկամտի սահմանափակում"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"Բնակարանի սահմանափակում (օրինակ՝ ննջասենյակների քանակ և/կամ զբաղվածություն)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"Ծրագրի սահմանափակում (օրինակ՝ CES ստորաբաժանում, վետերանների ստորաբաժանում, VASH ստորաբաժանում և այլն)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"Կապ հաստատելու փորձ։ Պատասխան չկա"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"Տնային տնտեսությունը կարիք չունի հասանելի միավորի հատկանիշների"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"Այլ"'::jsonb, true)
  WHERE language = 'hy' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'hy',
  '{"applicationUpdate":{"declineReasonChange":"Ձեր դիմումի մերժման պատճառը %{value} է","declineReason":{"ageRestriction":"Տարիքային սահմանափակում","incomeRestriction":"Եկամտի սահմանափակում","unitRestriction":"Բնակարանի սահմանափակում (օրինակ՝ ննջասենյակների քանակ և/կամ զբաղվածություն)","programRestriction":"Ծրագրի սահմանափակում (օրինակ՝ CES ստորաբաժանում, վետերանների ստորաբաժանում, VASH ստորաբաժանում և այլն)","attemptedToContactNoResponse":"Կապ հաստատելու փորձ։ Պատասխան չկա","householdDoesNotNeedAccessibleUnit":"Տնային տնտեսությունը կարիք չունի հասանելի միավորի հատկանիշների","other":"Այլ"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- fa
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"دلیل رد درخواست شما %{value} است."'::jsonb, true), '{applicationUpdate,declineReason,ageRestriction}', '"محدودیت سنی"'::jsonb, true), '{applicationUpdate,declineReason,incomeRestriction}', '"محدودیت درآمد"'::jsonb, true), '{applicationUpdate,declineReason,unitRestriction}', '"محدودیت واحد (مثلاً تعداد اتاق خواب و/یا میزان اشغال)"'::jsonb, true), '{applicationUpdate,declineReason,programRestriction}', '"محدودیت برنامه (مثلاً واحد CES، واحد کهنه سربازان، واحد VASH و غیره)"'::jsonb, true), '{applicationUpdate,declineReason,attemptedToContactNoResponse}', '"تلاش برای تماس؛ بدون پاسخ"'::jsonb, true), '{applicationUpdate,declineReason,householdDoesNotNeedAccessibleUnit}', '"خانوار به ویژگی‌های واحد قابل دسترس نیاز ندارد"'::jsonb, true), '{applicationUpdate,declineReason,other}', '"دیگر"'::jsonb, true)
  WHERE language = 'fa' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'fa',
  '{"applicationUpdate":{"declineReasonChange":"دلیل رد درخواست شما %{value} است.","declineReason":{"ageRestriction":"محدودیت سنی","incomeRestriction":"محدودیت درآمد","unitRestriction":"محدودیت واحد (مثلاً تعداد اتاق خواب و/یا میزان اشغال)","programRestriction":"محدودیت برنامه (مثلاً واحد CES، واحد کهنه سربازان، واحد VASH و غیره)","attemptedToContactNoResponse":"تلاش برای تماس؛ بدون پاسخ","householdDoesNotNeedAccessibleUnit":"خانوار به ویژگی‌های واحد قابل دسترس نیاز ندارد","other":"دیگر"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
