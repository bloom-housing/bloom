-- Adds welcome email translations for languages that were missing them.
UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "Maligayang pagdating",
    "welcomeMessage": "Salamat sa paglikha ng iyong account sa %{appUrl}. Magiging mas madali na ngayon para sa iyo na magsimula, mag-save, at magsumite ng mga online na aplikasyon para sa mga listahan na lumalabas sa site.",
    "confirmMyAccount": "Kumpirmahin ang aking account",
    "toConfirmAccountMessage": "Upang makumpleto ang paglikha ng iyong account, mangyaring i-click ang link sa ibaba:"
    }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "Chào mừng",
    "welcomeMessage": "Cảm ơn bạn đã tạo tài khoản trên %{appUrl}. Giờ đây bạn sẽ dễ dàng hơn trong việc bắt đầu, lưu và gửi đơn đăng ký trực tuyến cho các danh sách xuất hiện trên trang web.",
    "confirmMyAccount": "Xác nhận tài khoản của tôi",
    "toConfirmAccountMessage": "Để hoàn tất việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:"
    }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "欢迎",
    "welcomeMessage": "感谢您在 %{appUrl} 创建账户。现在您可以更轻松地开始、保存和提交网站上展示房源的在线申请。",
    "confirmMyAccount": "确认我的账户",
    "toConfirmAccountMessage": "要完成您的账户创建，请点击下面的链接："
    }'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "مرحباً",
    "welcomeMessage": "شكراً لإنشاء حسابك على %{appUrl}. سيكون من الأسهل الآن عليك بدء وحفظ وتقديم الطلبات عبر الإنترنت للقوائم المعروضة على الموقع.",
    "confirmMyAccount": "تأكيد حسابي",
    "toConfirmAccountMessage": "لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه:"
    }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "স্বাগতম",
    "welcomeMessage": "%{appUrl}-এ আপনার অ্যাকাউন্ট তৈরি করার জন্য ধন্যবাদ। এখন সাইটে প্রদর্শিত তালিকাগুলোর জন্য অনলাইনে আবেদন শুরু করা, সংরক্ষণ করা এবং জমা দেওয়া আপনার জন্য আরও সহজ হবে।",
    "confirmMyAccount": "আমার অ্যাকাউন্ট নিশ্চিত করুন",
    "toConfirmAccountMessage": "আপনার অ্যাকাউন্ট তৈরি সম্পূর্ণ করতে, দয়া করে নীচের লিঙ্কে ক্লিক করুন:"
    }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "환영합니다",
    "welcomeMessage": "%{appUrl}에서 계정을 생성해 주셔서 감사합니다. 이제 사이트에 게시된 목록에 대한 온라인 신청서를 더 쉽게 시작, 저장 및 제출할 수 있습니다.",
    "confirmMyAccount": "내 계정 확인",
    "toConfirmAccountMessage": "계정 생성을 완료하려면 아래 링크를 클릭하세요:"
    }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "Բարի գալուստ",
    "welcomeMessage": "Շնորհակալություն %{appUrl}-ում Ձեր հաշիվը ստեղծելու համար: Այժմ Ձեզ համար ավելի հեշտ կլինի սկսել, պահպանել և ներկայացնել առցանց դիմումներ կայքում հրապարակված ցուցակների համար:",
    "confirmMyAccount": "Հաստատել իմ հաշիվը",
    "toConfirmAccountMessage": "Ձեր հաշվի ստեղծումն ավարտելու համար, խնդրում ենք սեղմել ստորև բերված հղումը:"
    }'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{register}',
    '{
    "welcome": "خوش آمدید",
    "welcomeMessage": "از اینکه حساب خود را در %{appUrl} ایجاد کردید سپاسگزاریم. اکنون شروع، ذخیره و ارسال درخواست‌های آنلاین برای آگهی‌های موجود در سایت برای شما آسان‌تر خواهد بود.",
    "confirmMyAccount": "تأیید حساب من",
    "toConfirmAccountMessage": "برای تکمیل ایجاد حساب خود، لطفاً روی پیوند زیر کلیک کنید:"
    }'::jsonb
)
WHERE language = 'fa';
