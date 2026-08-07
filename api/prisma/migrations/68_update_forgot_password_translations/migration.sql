UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "Reset your password?",
  "resetRequest": "We received a request to reset your password for your Bloom Housing Portal account. You must click the following link to complete the reset:",
  "ignoreRequest": "This password reset is only valid for the next hour. If you didn’t make this request, please ignore this email."}'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "¿Restablecer su contraseña?",
  "resetRequest": "Recibimos una solicitud para restablecer la contraseña de su cuenta del Portal de Vivienda Bloom. Debe hacer clic en el siguiente enlace para completar el restablecimiento:",
  "ignoreRequest": "Este restablecimiento de contraseña solo es válido durante la próxima hora. Si usted no hizo esta solicitud, ignore este correo electrónico.",
  }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "Đặt lại mật khẩu của bạn?",
  "resetRequest": "Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản Cổng thông tin Nhà ở Bloom của bạn. Bạn phải nhấp vào liên kết sau để hoàn tất việc đặt lại:",
  "ignoreRequest": "Việc đặt lại mật khẩu này chỉ có hiệu lực trong một giờ tới. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.",
  }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "重置您的密码？",
  "resetRequest": "我们收到了重置您的 Bloom 住房门户账户密码的请求。您必须点击以下链接才能完成重置：",
  "ignoreRequest": "此密码重置仅在接下来的一小时内有效。如果您没有提出此请求，请忽略此电子邮件。",
  '::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "I-reset ang iyong password?",
  "resetRequest": "Nakatanggap kami ng kahilingan na i-reset ang password ng iyong account sa Bloom Housing Portal. Kailangan mong i-click ang sumusunod na link upang makumpleto ang pag-reset:",
  "ignoreRequest": "Ang pag-reset ng password na ito ay may bisa lamang sa loob ng susunod na isang oras. Kung hindi ikaw ang gumawa ng kahilingang ito, mangyaring huwag pansinin ang email na ito.",
  }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "আপনার পাসওয়ার্ড রিসেট করবেন?",
  "resetRequest": "আমরা আপনার Bloom হাউজিং পোর্টাল অ্যাকাউন্টের পাসওয়ার্ড রিসেট করার একটি অনুরোধ পেয়েছি। রিসেট সম্পূর্ণ করতে আপনাকে অবশ্যই নিচের লিঙ্কে ক্লিক করতে হবে:",
  "ignoreRequest": "এই পাসওয়ার্ড রিসেটটি শুধুমাত্র পরবর্তী এক ঘণ্টার জন্য বৈধ। আপনি যদি এই অনুরোধটি না করে থাকেন, তাহলে অনুগ্রহ করে এই ইমেলটি উপেক্ষা করুন।",
  }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "إعادة تعيين كلمة المرور الخاصة بك؟",
  "resetRequest": "لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك في بوابة Bloom للإسكان. يجب النقر على الرابط التالي لإكمال إعادة التعيين:",
  "ignoreRequest": "إعادة تعيين كلمة المرور هذه صالحة للساعة القادمة فقط. إذا لم تقم بتقديم هذا الطلب، فيرجى تجاهل هذا البريد الإلكتروني.",
  }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "비밀번호를 재설정하시겠습니까?",
  "resetRequest": "Bloom 주택 포털 계정의 비밀번호 재설정 요청을 받았습니다. 재설정을 완료하려면 다음 링크를 클릭해야 합니다:",
  "ignoreRequest": "이 비밀번호 재설정은 앞으로 1시간 동안만 유효합니다. 이 요청을 하지 않으셨다면 이 이메일을 무시하세요.",
  }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "Վերականգնե՞լ ձեր գաղտնաբառը:",
  "resetRequest": "Մենք ստացել ենք ձեր Bloom բնակարանային պորտալի հաշվի գաղտնաբառը վերականգնելու հարցում: Վերականգնումն ավարտելու համար դուք պետք է սեղմեք հետևյալ հղումը.",
  "ignoreRequest": "Գաղտնաբառի այս վերականգնումը վավեր է միայն հաջորդ մեկ ժամվա ընթացքում: Եթե դուք չեք կատարել այս հարցումը, խնդրում ենք անտեսել այս նամակը:",
  }'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{forgotPassword}',
  COALESCE(translations->'forgotPassword', '{}'::jsonb) || '{
  "subject": "بازنشانی رمز عبور شما؟",
  "resetRequest": "ما درخواستی برای بازنشانی رمز عبور حساب پورتال مسکن Bloom شما دریافت کردیم. برای تکمیل بازنشانی باید روی پیوند زیر کلیک کنید:",
  "ignoreRequest": "این بازنشانی رمز عبور فقط تا یک ساعت آینده معتبر است. اگر شما این درخواست را ثبت نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.",
  }'::jsonb
)
WHERE language = 'fa';
