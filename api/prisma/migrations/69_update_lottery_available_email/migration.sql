-- Adds new waitlist lottery confirmation translations for emails.
UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom generally does not accept duplicate applications. A duplicate application is one that has someone who also appears on another application for the same housing opportunity. For more detailed information on how we handle duplicates, see our",
            "header": "New Housing Lottery Results Available",
            "otherOpportunities1": "To view other housing opportunities, please visit %{appUrl}. You can sign up to receive notifications of new application opportunities",
            "otherOpportunities2": "here",
            "otherOpportunities3": "If you want to learn about how lotteries work, please see the lottery section of the",
            "otherOpportunities4": "Housing Portal Help Center",
            "resultsAvailable": "Results are available for a housing lottery for %{listingName}. See your housing portal account for more information.",
            "signIn": "Sign In to View Your Results",
            "termsOfUse": "Terms of Use",
            "whatHappensContent": "The property manager will begin to contact applicants by their preferred contact method. They will do so in the order of lottery rank, within each lottery preference. When the units are all filled, the property manager will stop contacting applicants. All the units could be filled before the property manager reaches your rank. If this happens, you will not be contacted.",
            "whatHappensHeader": "What happens next?"
        }'::jsonb
    )
WHERE
    language = 'en'
    AND jurisdiction_id IS NULL;

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "بشكل عام، لا تقبل Bloom الطلبات المكررة. ويُقصد بالطلب المكرر ذلك الطلب الذي يتضمن شخصاً يظهر أيضاً في طلب آخر لنفس فرصة السكن. لمزيد من التفاصيل حول كيفية تعاملنا مع الطلبات المكررة، يرجى الاطلاع على",
            "header": "نتائج قرعة الإسكان الجديدة متاحة الآن",
            "otherOpportunities1": "للاطلاع على فرص سكنية أخرى، يرجى زيارة %{appUrl}. يمكنك التسجيل لتلقي إشعارات حول فرص التقديم الجديدة",
            "otherOpportunities2": "هنا",
            "otherOpportunities3": "إذا كنت ترغب في معرفة المزيد عن كيفية عمل اليانصيب، فيرجى الاطلاع على قسم اليانصيب في",
            "otherOpportunities4": "مركز مساعدة بوابة الإسكان",
            "resultsAvailable": "تتوفر نتائج قرعة السكن الخاصة بـ %{listingName}. يرجى الاطلاع على حسابك في بوابة السكن لمزيد من المعلومات.",
            "signIn": "سجّل الدخول لعرض نتائجك",
            "termsOfUse": "شروط الاستخدام",
            "whatHappensContent": "سيبدأ مدير العقار بالتواصل مع المتقدمين عبر وسيلة الاتصال التي يفضلونها، وذلك وفقاً لترتيبهم في القرعة وضمن كل فئة من فئات الأولوية المحددة فيها. وسيتوقف مدير العقار عن التواصل مع المتقدمين بمجرد شغل جميع الوحدات السكنية؛ إذ قد يتم شغل كافة الوحدات قبل أن يصل الدور إليك وفقاً لترتيبك، وفي هذه الحالة لن يتم التواصل معك.",
            "whatHappensHeader": "ماذا يحدث بعد ذلك؟"
        }'::jsonb
    )
WHERE
    language = 'ar';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "ব্লুম সাধারণত একই আবাসন সুবিধার জন্য একাধিক আবেদনে একই ব্যক্তির নাম থাকলে—অর্থাৎ দ্বৈত আবেদন—তা গ্রহণ করে না। দ্বৈত আবেদনের বিষয়টি আমরা কীভাবে পরিচালনা করি সে সম্পর্কে বিস্তারিত তথ্যের জন্য আমাদের",
            "header": "নতুন আবাসন লটারির ফলাফল পাওয়া যাচ্ছে।",
            "otherOpportunities1": "বাসস্থানের অন্যান্য সুযোগগুলো দেখতে অনুগ্রহ করে %{appUrl} ভিজিট করুন। নতুন আবেদনের সুযোগ সম্পর্কে বিজ্ঞপ্তি পেতে আপনি সাইন আপ করতে পারেন।",
            "otherOpportunities2": "এখানে",
            "otherOpportunities3": "লটারি কীভাবে কাজ করে সে সম্পর্কে জানতে চাইলে, অনুগ্রহ করে লটারি বিভাগটি দেখুন।",
            "otherOpportunities4": "আবাসন পোর্টাল সহায়তা কেন্দ্র",
            "resultsAvailable": "%{listingName}-এর আবাসন লটারির ফলাফল পাওয়া যাচ্ছে। আরও তথ্যের জন্য আপনার হাউজিং পোর্টাল অ্যাকাউন্টটি দেখুন।",
            "signIn": "আপনার ফলাফল দেখতে সাইন ইন করুন",
            "termsOfUse": "ব্যবহারের শর্তাবলি",
            "whatHappensContent": "প্রপার্টি ম্যানেজার আবেদনকারীদের সাথে তাদের পছন্দের যোগাযোগ মাধ্যমের সাহায্যে যোগাযোগ করা শুরু করবেন। লটারির প্রতিটি অগ্রাধিকারের (preference) ক্ষেত্রে লটারির র‍্যাঙ্ক বা ক্রম অনুযায়ী এই যোগাযোগ করা হবে। সমস্ত ইউনিট বরাদ্দ হয়ে গেলে প্রপার্টি ম্যানেজার আবেদনকারীদের সাথে যোগাযোগ করা বন্ধ করে দেবেন। প্রপার্টি ম্যানেজার আপনার র‍্যাঙ্ক পর্যন্ত পৌঁছানোর আগেই হয়তো সব ইউনিট পূর্ণ হয়ে যেতে পারে; এমনটা ঘটলে আপনার সাথে আর যোগাযোগ করা হবে না।",
            "whatHappensHeader": "এরপর কী হবে?"
        }'::jsonb
    )
WHERE
    language = 'bn';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom generalmente no acepta solicitudes duplicadas. Una solicitud duplicada es aquella en la que aparece una persona que también aparece en otra solicitud para la misma oportunidad de vivienda. Para obtener información más detallada sobre cómo manejamos las solicitudes duplicadas, consulte nuestros",
            "header": "Nuevos resultados de la lotería de vivienda disponibles",
            "otherOpportunities1": "Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud",
            "otherOpportunities2": "aquí",
            "otherOpportunities3": "Si desea obtener información sobre cómo funcionan las loterías, consulte la sección de lotería del",
            "otherOpportunities4": "Housing Portal Centro de ayuda",
            "resultsAvailable": "Los resultados están disponibles para una lotería de vivienda para %{listingName}. Consulte su cuenta del portal de vivienda para obtener más información.",
            "signIn": "Inicie sesión para ver sus resultados",
            "termsOfUse": "Términos de uso",
            "whatHappensContent": "El administrador de la propiedad comenzará a comunicarse con los solicitantes mediante su método de contacto preferido. Lo harán en el orden de clasificación de la lotería, dentro de cada preferencia de lotería. Cuando todas las unidades estén ocupadas, el administrador de la propiedad dejará de comunicarse con los solicitantes. Todas las unidades podrían llenarse antes de que el administrador de la propiedad alcance su rango. Si esto sucede, no lo contactaremos.",
            "whatHappensHeader": "¿Qué pasa después?"
        }'::jsonb
    )
WHERE
    language = 'es';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "بلوم عموماً درخواست‌های تکراری را نمی‌پذیرد. درخواست تکراری، درخواستی است که در آن شخصی در درخواست دیگری برای همان فرصت مسکن نیز حضور دارد. برای اطلاعات بیشتر در مورد نحوه رسیدگی ما به درخواست‌های تکراری، به وب‌سایت ما مراجعه کنید",
            "header": "نتایج جدید قرعه کشی مسکن منتشر شد",
            "otherOpportunities1": "برای مشاهده سایر فرصت‌های مسکن، لطفاً به %{appUrl} مراجعه کنید. می‌توانید برای دریافت اعلان‌های مربوط به فرصت‌های جدید درخواست، ثبت‌نام کنید",
            "otherOpportunities2": "اینجا",
            "otherOpportunities3": "اگر می‌خواهید درباره نحوه کار لاتاری‌ها اطلاعات کسب کنید، لطفاً به بخش لاتاری مراجعه کنید",
            "otherOpportunities4": "مرکز راهنمایی پورتال مسکن",
            "resultsAvailable": "نتایج قرعه‌کشی مسکن برای %{listingName} در دسترس است. برای اطلاعات بیشتر به حساب کاربری پورتال مسکن خود مراجعه کنید.",
            "signIn": "برای مشاهده نتایج خود وارد شوید",
            "termsOfUse": "شرایط استفاده",
            "whatHappensContent": "مدیر املاک با استفاده از روش تماس ترجیحی متقاضیان، شروع به تماس با آنها خواهد کرد. آنها این کار را به ترتیب رتبه قرعه‌کشی و در هر اولویت قرعه‌کشی انجام خواهند داد. وقتی همه واحدها پر شدند، مدیر املاک تماس با متقاضیان را متوقف می‌کند. ممکن است همه واحدها قبل از اینکه مدیر املاک به رتبه شما برسد، پر شده باشند. در این صورت، با شما تماسی گرفته نخواهد شد.",
            "whatHappensHeader": "بعدش چی میشه؟"
        }'::jsonb
    )
WHERE
    language = 'fa';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom-ը, որպես կանոն, չի ընդունում կրկնօրինակ դիմումներ: Կրկնօրինակ դիմումը այն դիմումն է, որի դեպքում անձը նույնպես նշված է նույն բնակարանային հնարավորության համար նախատեսված մեկ այլ դիմումում: Կրկնօրինակ դիմումների հետ վարվելու վերաբերյալ ավելի մանրամասն տեղեկությունների համար տե՛ս մեր",
            "header": "Նոր բնակարանային վիճակախաղի արդյունքները հասանելի են",
            "otherOpportunities1": "Այլ բնակարանային հնարավորություններ դիտելու համար այցելեք %{appUrl} կայքը։ Կարող եք գրանցվել՝ նոր դիմումների հնարավորությունների մասին ծանուցումներ ստանալու համար։",
            "otherOpportunities2": "այստեղ",
            "otherOpportunities3": "Եթե ​​ցանկանում եք իմանալ, թե ինչպես են գործում վիճակախաղերը, խնդրում ենք դիտել վիճակախաղի բաժինը",
            "otherOpportunities4": "Բնակարանային պորտալի օգնության կենտրոն",
            "resultsAvailable": "%{listingName}-ի բնակարանային վիճակախաղի արդյունքները հասանելի են։ Լրացուցիչ տեղեկությունների համար այցելեք ձեր բնակարանային պորտալի հաշիվը։",
            "signIn": "Մուտք գործեք՝ ձեր արդյունքները դիտելու համար",
            "termsOfUse": "Օգտագործման պայմաններ",
            "whatHappensContent": "Գույքի կառավարիչը կսկսի կապ հաստատել դիմորդների հետ՝ օգտագործելով նրանց նախընտրած կապի մեթոդը։ Նրանք դա կանեն վիճակախաղի դասակարգման հերթականությամբ՝ յուրաքանչյուր վիճակախաղի նախընտրության շրջանակներում։ Երբ բնակարանները բոլորը լցվեն, գույքի կառավարիչը կդադարի դիմորդների հետ կապ հաստատել։ Բոլոր բնակարանները կարող են լցվել նախքան գույքի կառավարիչը հասնի ձեր դասակարգմանը։ Եթե դա տեղի ունենա, ձեզ հետ կապ չեն հաստատի։",
            "whatHappensHeader": "Ի՞նչ է լինելու հաջորդը։"
        }'::jsonb
    )
WHERE
    language = 'hy';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom은 일반적으로 중복 신청을 허용하지 않습니다. 중복 신청이란 동일한 주택 공급 건에 대해 다른 신청서에도 이름이 올라가 있는 지원자가 포함된 경우를 의미합니다. 중복 신청 처리 방식에 대한 자세한 내용은 다음을 참조하십시오",
            "header": "신규 주택 추첨 결과 확인 가능",
            "otherOpportunities1": "다른 주거 기회를 확인하시려면 %{appUrl}을(를) 방문해 주십시오. 새로운 신청 기회에 대한 알림을 받도록 등록하실 수 있습니다",
            "otherOpportunities2": "여기",
            "otherOpportunities3": "복권이 어떻게 작동하는지 알고 싶으시면 복권 섹션을 참조하십시오",
            "otherOpportunities4": "주거 포털 고객지원 센터",
            "resultsAvailable": "%{listingName}에 대한 주택 추첨 결과가 확인 가능합니다. 자세한 내용은 주택 포털 계정에서 확인해 주십시오.",
            "signIn": "로그인하여 결과를 확인하세요",
            "termsOfUse": "이용 약관",
            "whatHappensContent": "주택 관리자는 신청자가 선호하는 연락 방법을 통해 신청자에게 연락을 시작할 것입니다. 이때 각 추첨 우선순위 내에서 추첨 순위에 따라 연락이 진행됩니다. 모든 세대가 배정되면 관리자는 더 이상 신청자에게 연락하지 않습니다. 관리자가 귀하의 순서에 도달하기 전에 모든 세대가 배정될 수도 있으며, 이 경우 귀하에게는 연락이 가지 않습니다.",
            "whatHappensHeader": "그다음에는 무슨 일이 일어나나요?"
        }'::jsonb
    )
WHERE
    language = 'ko';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Ang Bloom sa pangkalahatan ay hindi tumatanggap ng mga duplicate na aplikasyon. Ang isang duplicate na aplikasyon ay isa na mayroong isang tao na lumilitaw din sa isa pang aplikasyon para sa parehong pagkakataon sa pabahay. Para sa mas detalyadong impormasyon sa kung paano namin pinangangasiwaan ang mga duplicate, tingnan ang aming",
            "header": "Bagong Housing Lottery Resulta Available",
            "otherOpportunities1": "Upang tingnan ang iba pang pagkakataon sa pabahay, pakibisita ang %{appUrl}. Maaari kang mag-sign up upang makatanggap ng mga abiso ng mga bagong pagkakataon sa aplikasyon",
            "otherOpportunities2": "dito",
            "otherOpportunities3": "Kung gusto mong malaman kung paano gumagana ang mga lottery, pakitingnan ang seksyon ng lottery ng",
            "otherOpportunities4": "Housing Portal Help Center",
            "resultsAvailable": "Available ang mga resulta para sa isang housing lottery para sa %{listingName}. Tingnan ang iyong housing portal account para sa higit pang impormasyon.",
            "signIn": "Mag-sign In upang Tingnan ang Iyong Mga Resulta",
            "termsOfUse": "Mga Tuntunin ng Paggamit",
            "whatHappensContent": "Magsisimulang makipag-ugnayan ang property manager sa mga aplikante sa pamamagitan ng kanilang gustong paraan ng pakikipag-ugnayan. Gagawin nila ito sa pagkakasunud-sunod ng ranggo ng lottery, sa loob ng bawat kagustuhan sa lottery. Kapag napuno na ang lahat ng unit, hihinto na ang property manager sa pakikipag-ugnayan sa mga aplikante. Maaaring mapunan ang lahat ng unit bago maabot ng property manager ang iyong ranggo. Kung mangyari ito, hindi ka makontak.",
            "whatHappensHeader": "Anong mangyayari sa susunod?"
        }'::jsonb
    )
WHERE
    language = 'tl';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom thường không chấp nhận các đơn xin trùng lặp. Một đơn xin trùng lặp là đơn xin có người cũng xuất hiện trên một đơn xin khác cho cùng một cơ hội nhà ở. Để biết thông tin chi tiết hơn về cách chúng tôi xử lý các đơn xin trùng lặp, hãy xem của chúng tôi",
            "header": "Đã có kết quả xổ số nhà ở mới",
            "otherOpportunities1": "Để xem các cơ hội nhà ở khác, vui lòng truy cập %{appUrl}. Bạn có thể đăng ký để nhận thông báo về các cơ hội ứng tuyển mới",
            "otherOpportunities2": "đây",
            "otherOpportunities3": "Nếu bạn muốn tìm hiểu về cách hoạt động của xổ số, vui lòng xem phần xổ số của",
            "otherOpportunities4": "Housing Portal Trung tâm trợ giúp",
            "resultsAvailable": "Đã có kết quả xổ số nhà ở cho %{listingName}. Xem tài khoản cổng thông tin nhà ở của bạn để biết thêm thông tin.",
            "signIn": "Đăng nhập để xem kết quả của bạn",
            "termsOfUse": "Điều khoản sử dụng",
            "whatHappensContent": "Người quản lý tài sản sẽ bắt đầu liên hệ với người nộp đơn bằng phương thức liên hệ ưa thích của họ. Họ sẽ làm như vậy theo thứ tự xếp hạng xổ số, trong mỗi ưu tiên xổ số. Khi các căn hộ đã được lấp đầy, người quản lý tài sản sẽ ngừng liên hệ với người nộp đơn. Tất cả các đơn vị có thể được lấp đầy trước khi người quản lý tài sản đạt đến cấp bậc của bạn. Nếu điều này xảy ra, bạn sẽ không được liên lạc.",
            "whatHappensHeader": "Chuyện gì xảy ra tiếp theo?"
        }'::jsonb
    )
WHERE
    language = 'vi';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Bloom 一般不接受重复申请。重复申请是指申请者与另一份申请者有相同的住房机会。有关我们如何处理重复申请的更多详细信息，请参阅我们的",
            "header": "新住房抽籤結果公佈",
            "otherOpportunities1": "要查看其他住房機會，請訪問 %{appUrl}。您可以註冊接收新申請機會的通知",
            "otherOpportunities2": "這裡",
            "otherOpportunities3": "如果您想了解彩票的運作方式，請參閱網站的彩票部分",
            "otherOpportunities4": "Housing Portal 幫助中心",
            "resultsAvailable": "%{listingName} 的住房抽籤結果可用。請參閱您的住房入口網站帳戶以獲取更多資訊。",
            "signIn": "登入查看您的結果",
            "termsOfUse": "使用条款",
            "whatHappensContent": "物業經理將開始透過申請人首選的聯絡方式與申請人聯繫。他們將按照每個彩票偏好中的彩票排名順序進行操作。當單位全部住滿後，物業經理將停止聯絡申請人。在物業經理達到您的等級之前，所有單位都可以被填滿。如果發生這種情況，我們將不會與您聯繫。",
            "whatHappensHeader": "接下來發生什麼事？"
        }'::jsonb
    )
WHERE
    language = 'zh';