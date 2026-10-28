-- Adds advocate-specific copy and applicant contact copy for account acceptation/rejection emails.


UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
        "subject": "Your account has been approved",
        "hello": "Hello",
        "approvalMessage": "Your account at %{appUrl} has been approved.",
        "approvalInfo": "It will now be easier for you to start, save, and submit online applications <strong>on behalf of housing applicants</strong> for listings that appear on the site.",
        "completeMessage": "To complete your account creation, please click the link below:",
        "createAccount": "Create my account"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "Update about your account request",
      "hello": "Hello",
      "rejectionMessageStart": "Thank you for your interest in creating an account on %{appUrl}.",
      "rejectionMessageEnd": "We are not able to approve your account at this time.",
      "rejectionInfoStart": "If you believe this decision was made in error or have questions about eligibility, please contact us at",
      "rejectionInfoEnd": "for more information."
  }'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "Su cuenta ha sido aprobada",
      "hello": "Hola",
      "approvalMessage": "Su cuenta en %{appUrl} ha sido aprobada.",
      "approvalInfo": "Ahora le resultará más fácil iniciar, guardar y enviar solicitudes en línea <strong>en nombre de solicitantes de vivienda</strong> para los listados que aparecen en el sitio.",
      "completeMessage": "Para completar la creación de su cuenta, haga clic en el siguiente enlace:",
      "createAccount": "Crear mi cuenta"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "Actualización sobre su solicitud de cuenta",
      "hello": "Hola",
      "rejectionMessageStart": "Gracias por su interés en crear una cuenta en %{appUrl}.",
      "rejectionMessageEnd": "No podemos aprobar su cuenta en este momento.",
      "rejectionInfoStart": "Si cree que esta decisión fue un error o tiene preguntas sobre la elegibilidad, comuníquese con nosotros en",
      "rejectionInfoEnd": "para obtener más información."
  }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "Tài khoản của bạn đã được phê duyệt",
      "hello": "Xin chào",
      "approvalMessage": "Tài khoản của bạn tại %{appUrl} đã được phê duyệt.",
      "approvalInfo": "Giờ đây sẽ dễ dàng hơn để bạn bắt đầu, lưu và gửi các ứng dụng trực tuyến <strong>thay mặt cho các ứng viên nhà ở</strong> cho các danh sách xuất hiện trên trang web.",
      "completeMessage": "Để hoàn thành việc tạo tài khoản của bạn, vui lòng nhấp vào liên kết dưới đây:",
      "createAccount": "Tạo tài khoản của tôi"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "Cập nhật về yêu cầu tài khoản của bạn",
      "hello": "Xin chào",
      "rejectionMessageStart": "Cảm ơn bạn đã quan tâm đến việc tạo tài khoản trên %{appUrl}.",
      "rejectionMessageEnd": "Chúng tôi không thể phê duyệt tài khoản của bạn vào lúc này.",
      "rejectionInfoStart": "Nếu bạn tin rằng quyết định này được đưa ra do sai sót hoặc có câu hỏi về đủ điều kiện, vui lòng liên hệ với chúng tôi tại",
      "rejectionInfoEnd": "để biết thêm thông tin."
  }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "您的账户已被批准",
      "hello": "您好",
      "approvalMessage": "您在 %{appUrl} 的账户已被批准。",
      "approvalInfo": "现在您可以更轻松地代表住房申请人开始、保存和提交在线申请，申请针对网站上显示的列表。",
      "completeMessage": "要完成您的账户创建，请点击下面的链接：",
      "createAccount": "创建我的账户"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "关于您的账户申请的更新",
      "hello": "您好",
      "rejectionMessageStart": "感谢您对在 %{appUrl} 创建账户的兴趣。",
      "rejectionMessageEnd": "我们目前无法批准您的账户。",
      "rejectionInfoStart": "如果您认为这个决定是错误的或对资格有疑问，请通过以下方式与我们联系",
      "rejectionInfoEnd": "获取更多信息。"
  }'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "Ang iyong account ay na-apruba na",
      "hello": "Kamusta",
      "approvalMessage": "Ang iyong account sa %{appUrl} ay na-apruba na.",
      "approvalInfo": "Mas magiging madali na para sa iyo na magsimula, magsave, at magsumite ng online applications <strong>para sa mgap housing applicants</strong> para sa mga listings na lumalabas sa site.",
      "completeMessage": "Upang makumpleto ang iyong account creation, mangyaring i-click ang link sa ibaba:",
      "createAccount": "Lumikha ng aking account"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "Update tungkol sa iyong account request",
      "hello": "Kamusta",
      "rejectionMessageStart": "Salamat sa iyong interes na lumikha ng account sa %{appUrl}.",
      "rejectionMessageEnd": "Hindi kami makakabigay ng approval sa iyong account sa ngayon.",
      "rejectionInfoStart": "Kung naniniwala ka na ang desisyon na ito ay nagawa sa error o mayroon kang mga tanong tungkol sa eligibility, mangyaring makipag-ugnayan sa amin sa",
      "rejectionInfoEnd": "para sa higit pang impormasyon."
  }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে",
      "hello": "হ্যালো",
      "approvalMessage": "%{appUrl} এ আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে।",
      "approvalInfo": "আপনার জন্য এখন আরও সহজ হবে শুরু করা, সংরক্ষণ করা এবং অনলাইন আবেদন জমা দেওয়া <strong>আবাসন আবেদনকারীদের পক্ষে</strong> সাইটে উপস্থিত তালিকার জন্য।",
      "completeMessage": "আপনার অ্যাকাউন্ট তৈরি সম্পূর্ণ করতে, দয়া করে নীচের লিঙ্কটিতে ক্লিক করুন:",
      "createAccount": "আমার অ্যাকাউন্ট তৈরি করুন"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "আপনার অ্যাকাউন্ট অনুরোধ সম্পর্কে আপডেট",
      "hello": "হ্যালো",
      "rejectionMessageStart": "%{appUrl} এ একটি অ্যাকাউন্ট তৈরিতে আপনার আগ্রহের জন্য ধন্যবাদ।",
      "rejectionMessageEnd": "আমরা এই সময়ে আপনার অ্যাকাউন্ট অনুমোদন করতে পারি না।",
      "rejectionInfoStart": "যদি আপনি বিশ্বাস করেন যে এই সিদ্ধান্তটি ত্রুটিতে নেওয়া হয়েছে বা যোগ্যতা সম্পর্কে প্রশ্ন থাকে, দয়া করে আমাদের সাথে যোগাযোগ করুন",
      "rejectionInfoEnd": "আরও তথ্যের জন্য।"
  }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "تم الموافقة على حسابك",
      "hello": "مرحبا",
      "approvalMessage": "تمت الموافقة على حسابك في %{appUrl}.",
      "approvalInfo": "سيكون من الأسهل الآن عليك البدء وحفظ وتقديم الطلبات عبر الإنترنت <strong>نيابة عن مقدمي طلبات الإسكان</strong> للقوائم المعروضة على الموقع.",
      "completeMessage": "لإكمال إنشاء حسابك، يرجى النقر على الرابط أدناه:",
      "createAccount": "إنشاء حسابي"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "تحديث بشأن طلب حسابك",
      "hello": "مرحبا",
      "rejectionMessageStart": "شكراً لاهتمامك بإنشاء حساب على %{appUrl}.",
      "rejectionMessageEnd": "لا يمكننا الموافقة على حسابك في الوقت الحالي.",
      "rejectionInfoStart": "إذا كنت تعتقد أن هذا القرار تم اتخاذه بالخطأ أو لديك أسئلة حول الأهلية، يرجى الاتصال بنا على",
      "rejectionInfoEnd": "للحصول على مزيد من المعلومات."
  }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "계정이 승인되었습니다",
      "hello": "안녕하세요",
      "approvalMessage": "%{appUrl}의 계정이 승인되었습니다.",
      "approvalInfo": "이제 주택 신청자를 대신하여 온라인 신청서를 쉽게 시작, 저장 및 제출할 수 있습니다 <strong>사이트에 나타나는 목록에 대해</strong>.",
      "completeMessage": "계정 생성을 완료하려면 아래 링크를 클릭하세요:",
      "createAccount": "내 계정 만들기"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "계정 요청에 대한 업데이트",
      "hello": "안녕하세요",
      "rejectionMessageStart": "%{appUrl}에서 계정을 만들려는 관심을 가져주셔서 감사합니다.",
      "rejectionMessageEnd": "현재 귀하의 계정을 승인할 수 없습니다.",
      "rejectionInfoStart": "이 결정이 오류로 인해 결정되었다고 생각하거나 자격 요건에 대해 질문이 있으면 다음 주소로 문의하세요",
      "rejectionInfoEnd": "자세한 내용은"
  }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "Ձեր հաշիվը հաստատվել է",
      "hello": "Բարեւ",
      "approvalMessage": "Ձեր հաշիվը %{appUrl}-ում հաստատվել է:",
      "approvalInfo": "Այժմ ավելի հեշտ կլինի հստեղել, պահել և ներկայացնել առցանց դիմումներ <strong>բնակարանային դիմորդների կամ հետ</strong> կայքում հայտնված ցուցակների համար:",
      "completeMessage": "Ձեր հաշվի ստեղծումն ավարտելու համար խնդրում ենք կտտացնել ստորեւ բերված հղումը.",
      "createAccount": "Ստեղծել իմ հաշիվը"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
      "subject": "Թարմացում ձեր հաշվի հարցումի վերաբերյալ",
      "hello": "Բարեւ",
      "rejectionMessageStart": "Շնորհակալ ենք %{appUrl}-ում հաշիվ ստեղծելու միջնորդության համար:",
      "rejectionMessageEnd": "Մենք չենք կարող հաստատել ձեր հաշիվը այս պահին:",
      "rejectionInfoStart": "Եթե Դուք կարծում եք, որ այս որոշումը սխալ է կամ ունեք հարցեր պատկանելիության վերաբերյալ, խնդրում ենք մեզ հետ կապ հաստատել",
      "rejectionInfoEnd": "ավելի շատ տեղեկատվության համար:"
  }'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    translations,
    '{advocateApproved}',
    COALESCE(translations->'advocateApproved', '{}'::jsonb) || '{
      "subject": "حساب شما تأیید شد",
      "hello": "سلام",
      "approvalMessage": "حساب شما در %{appUrl} تأیید شد.",
      "approvalInfo": "اکنون برای شما آسان‌تر خواهد بود که برنامه‌های آنلاین را شروع، ذخیره و ارسال کنید <strong>به نمایندگی از متقاضیان مسکن</strong> برای فهرست‌های موجود در سایت.",
      "completeMessage": "برای تکمیل ایجاد حساب خود، لطفاً روی پیوند زیر کلیک کنید:",
      "createAccount": "ایجاد حساب من"
    }'::jsonb
  ),
  '{advocateRejected}',
  COALESCE(translations->'advocateRejected', '{}'::jsonb) || '{
    "subject": "بروزرسانی درخصوص درخواست حساب شما",
    "hello": "سلام",
    "rejectionMessageStart": "با تشکر از علاقه‌مندی شما به ایجاد حساب در %{appUrl}.",
    "rejectionMessageEnd": "ما در حال حاضر نمی‌توانیم حساب شما را تأیید کنیم.",
    "rejectionInfoStart": "اگر فکر می‌کنید این تصمیم اشتباهی است یا سؤالاتی درباره واجدین شرایط دارید، لطفاً با ما تماس بگیرید",
    "rejectionInfoEnd": "برای اطلاعات بیشتر."
  }'::jsonb
)
WHERE language = 'fa';