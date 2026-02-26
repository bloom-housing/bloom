-- Adds advocate-specific copy and applicant contact copy for application update emails.

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "If you have questions regarding this update, please reach out at",
      "advocateUpdateNotice": "An update has been made to the housing application you submitted on behalf of %{applicantName} for %{listingName}.",
      "advocateViewPrompt": "To view your client''s application, please click the link below:",
      "advocateViewLink": "View application"
    }'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "Si tiene preguntas sobre esta actualización, comuníquese con nosotros en",
      "advocateUpdateNotice": "Se ha realizado una actualización a la solicitud de vivienda que envió en nombre de %{applicantName} para %{listingName}.",
      "advocateViewPrompt": "Para ver la solicitud de su cliente, haga clic en el siguiente enlace:",
      "advocateViewLink": "Ver aplicación"
    }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "Kung mayroon kayong mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa",
      "advocateUpdateNotice": "May ginawang update sa aplikasyon para sa pabahay na isinumite mo sa ngalan ni %{applicantName} para sa %{listingName}.",
      "advocateViewPrompt": "Para makita ang aplikasyon ng inyong kliyente, paki-click ang link sa ibaba:",
      "advocateViewLink": "Tingnan ang aplikasyon"
    }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:",
      "advocateUpdateNotice": "Đã có bản cập nhật cho đơn xin nhà ở mà bạn đã nộp thay mặt cho %{applicantName} tại %{listingName}.",
      "advocateViewPrompt": "Để xem hồ sơ ứng tuyển của khách hàng, vui lòng nhấp vào liên kết bên dưới:",
      "advocateViewLink": "Xem ứng dụng"
    }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "如果您对本次更新有任何疑问，请联系我们。",
      "advocateUpdateNotice": "您代表 %{applicantName} 提交的关于 %{listingName} 的住房申请已更新。",
      "advocateViewPrompt": "要查看您客户的申请，请点击以下链接：",
      "advocateViewLink": "查看应用程序"
    }'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يرجى التواصل معنا على",
      "advocateUpdateNotice": "تم تحديث طلب السكن الذي قدمته نيابة عن %{applicantName} لـ %{listingName}.",
      "advocateViewPrompt": "للاطلاع على طلب عميلك، يرجى النقر على الرابط أدناه:",
      "advocateViewLink": "عرض الطلب"
    }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    COALESCE(translations->'applicationUpdate', '{}'::jsonb) || '{
      "applicantContactNotice": "এই আপডেট সম্পর্কে আপনার যদি কোন প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন",
      "advocateUpdateNotice": "%{applicantName} এর পক্ষ থেকে %{listingName} এর জন্য আপনার জমা দেওয়া আবাসন আবেদনের একটি আপডেট করা হয়েছে।",
      "advocateViewPrompt": "আপনার ক্লায়েন্টের আবেদন দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:",
      "advocateViewLink": "আবেদন দেখুন"
    }'::jsonb
)
WHERE language = 'bn';

INSERT INTO translations ("language", "translations", "created_at", "updated_at")
VALUES (
  'fa',
  jsonb_build_object(
    'applicationUpdate',
    '{
      "subject": "به‌روزرسانی برنامه برای %{listingName}",
      "title": "برنامه شما برای %{listingName} به‌روزرسانی شده است.",
      "greeting": "سلام",
      "updateNotice": "به‌روزرسانی در درخواست مسکن شما برای %{listingName} انجام شد.",
      "summaryTitle": "خلاصه تغییرات:",
      "statusChange": "وضعیت درخواست شما از %{from} به %{to} تغییر کرده است.",
      "accessibleWaitListChange": "شماره لیست انتظار قابل دسترس شما %{value} است.",
      "conventionalWaitListChange": "شماره لیست انتظار متعارف شما %{value} است.",
      "statusLabel": "وضعیت درخواست",
      "contactNotice": "در حال حاضر هیچ اقدام دیگری لازم نیست. اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید.",
      "viewPrompt": "برای مشاهده درخواست خود، لطفاً روی لینک زیر کلیک کنید:",
      "viewLink": "مشاهده درخواست من",
      "applicantContactNotice": "اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید",
      "advocateUpdateNotice": "درخواست مسکنی که از طرف %{applicantName} برای %{listingName} ارسال کرده بودید، به‌روزرسانی شد.",
      "advocateViewPrompt": "برای مشاهده درخواست مشتری خود، لطفاً روی لینک زیر کلیک کنید:",
      "advocateViewLink": "مشاهده برنامه",
      "applicationStatus": {
        "submitted": "ارسال شده",
        "declined": "رد شد",
        "receivedUnit": "واحد دریافت شد",
        "waitlist": "لیست انتظار",
        "waitlistDeclined": "لیست انتظار - رد شد"
      }
    }'::jsonb
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO translations ("language", "translations", "created_at", "updated_at")
VALUES (
  'ko',
  jsonb_build_object(
    'applicationUpdate',
    '{
      "subject": "%{listingName}에 대한 애플리케이션 업데이트",
      "title": "귀하의 신청서가 %{listingName}에 대해 업데이트되었습니다.",
      "greeting": "안녕하세요",
      "updateNotice": "%{listingName}에 대한 주택 신청서가 업데이트되었습니다.",
      "summaryTitle": "변경 사항 요약:",
      "statusChange": "신청 상태가 %{from}에서 %{to}로 변경되었습니다.",
      "accessibleWaitListChange": "귀하의 장애인 대기자 명단 순번은 %{value}입니다.",
      "conventionalWaitListChange": "귀하의 일반 대기자 명단 순번은 %{value}입니다.",
      "statusLabel": "신청 상태",
      "contactNotice": "현재로서는 추가 조치가 필요하지 않습니다. 이번 업데이트와 관련하여 궁금한 사항이 있으시면 문의해 주세요.",
      "viewPrompt": "신청서를 보시려면 아래 링크를 클릭하세요.",
      "viewLink": "내 지원서를 봐주세요",
      "applicantContactNotice": "이번 업데이트와 관련하여 궁금한 사항이 있으시면 언제든지 문의해 주세요.",
      "advocateUpdateNotice": "귀하께서 %{applicantName} 님을 대신하여 %{listingName}에 제출하신 주택 신청서가 업데이트되었습니다.",
      "advocateViewPrompt": "고객님의 신청서를 보시려면 아래 링크를 클릭하십시오.",
      "advocateViewLink": "지원서 보기",
      "applicationStatus": {
        "submitted": "제출된",
        "declined": "거절됨",
        "receivedUnit": "유닛을 받았습니다",
        "waitlist": "대기자 명단",
        "waitlistDeclined": "대기자 명단 - 거절됨"
      }
    }'::jsonb
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

INSERT INTO translations ("language", "translations", "created_at", "updated_at")
VALUES (
  'hy',
  jsonb_build_object(
    'applicationUpdate',
    '{
      "subject": "%{listingName} ծրագրի թարմացում",
      "title": "Ձեր ծրագիրը թարմացվել է %{listingName}-ի համար",
      "greeting": "Բարև",
      "updateNotice": "Ձեր %{listingName}-ի բնակարանային դիմումը թարմացվել է։",
      "summaryTitle": "Փոփոխությունների ամփոփում.",
      "statusChange": "Ձեր դիմումի կարգավիճակը փոխվել է %{from}-ից մինչև %{to}",
      "accessibleWaitListChange": "Ձեր հասանելի սպասման ցուցակի համարը %{value} է",
      "conventionalWaitListChange": "Ձեր սովորական սպասման ցուցակի համարը %{value} է",
      "statusLabel": "Դիմումի կարգավիճակը",
      "contactNotice": "Այս պահին որևէ հետագա գործողություն անհրաժեշտ չէ: Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով՝",
      "viewPrompt": "Ձեր դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը՝",
      "viewLink": "Դիտել իմ դիմումը",
      "applicantContactNotice": "Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով.",
      "advocateUpdateNotice": "%{applicantName}-ի անունից %{listingName}-ի համար ձեր ներկայացրած բնակարանային դիմումը թարմացվել է։",
      "advocateViewPrompt": "Ձեր հաճախորդի դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը.",
      "advocateViewLink": "Դիտել դիմումը",
      "applicationStatus": {
        "submitted": "Ուղարկված է",
        "declined": "Մերժված է",
        "receivedUnit": "Ստացել է միավոր",
        "waitlist": "Սպասման ցուցակ",
        "waitlistDeclined": "Սպասման ցուցակ - Մերժված է"
      }
    }'::jsonb
  ),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "user_accounts_email_idx" ON "user_accounts"("email");