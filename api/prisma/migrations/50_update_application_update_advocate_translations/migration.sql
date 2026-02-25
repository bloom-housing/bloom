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

-- CreateIndex
CREATE INDEX "user_account_snapshot_email_idx" ON "user_account_snapshot"("email");

-- CreateIndex
CREATE INDEX "user_accounts_email_idx" ON "user_accounts"("email");