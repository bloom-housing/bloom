-- Adds new waitlist lottery confirmation translations for emails.
UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        COALESCE(translations->'lotteryAvailable', '{}'::jsonb) || '{
            "duplicatesDetails": "Doorway generally does not accept duplicate applications. A duplicate application is one that has someone who also appears on another application for the same housing opportunity. For more detailed information on how we handle duplicates, see our",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "Terms of Use",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "بشكل عام، لا تقبل Doorway الطلبات المكررة. ويُقصد بالطلب المكرر ذلك الطلب الذي يتضمن شخصاً يظهر أيضاً في طلب آخر لنفس فرصة السكن. لمزيد من التفاصيل حول كيفية تعاملنا مع الطلبات المكررة، يرجى الاطلاع على",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "شروط الاستخدام",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "সাধারণত ডোরওয়ে (Doorway) একই আবাসন সুবিধার জন্য একাধিক আবেদনে একই ব্যক্তির নাম থাকা বা দ্বৈত আবেদন (duplicate application) গ্রহণ করে না। দ্বৈত আবেদনের বিষয়টি আমরা কীভাবে পরিচালনা করি সে সম্পর্কে বিস্তারিত তথ্যের জন্য আমাদের",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "ব্যবহারের শর্তাবলি",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway generalmente no acepta solicitudes duplicadas. Una solicitud duplicada es aquella en la que aparece una persona que también aparece en otra solicitud para la misma oportunidad de vivienda. Para obtener información más detallada sobre cómo manejamos las solicitudes duplicadas, consulte nuestros",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "Términos de uso",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway معمولاً درخواست‌های تکراری را نمی‌پذیرد. درخواست تکراری، درخواستی است که در آن شخصی در درخواست دیگری برای همان فرصت مسکن نیز حضور دارد. برای اطلاعات بیشتر در مورد نحوه رسیدگی ما به درخواست‌های تکراری، به وب‌سایت ما مراجعه کنید",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "شرایط استفاده",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway-ը, որպես կանոն, չի ընդունում կրկնօրինակ դիմումներ: Կրկնօրինակ դիմումը այն դիմումն է, որի դեպքում անձը նույնպես նշված է նույն բնակարանային հնարավորության համար նախատեսված մեկ այլ դիմումում: Կրկնօրինակ դիմումների հետ վարվելու վերաբերյալ ավելի մանրամասն տեղեկությունների համար տե՛ս մեր",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "Օգտագործման պայմաններ",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway은 일반적으로 중복 신청을 허용하지 않습니다. 중복 신청이란 동일한 주택 공급 건에 대해 다른 신청서에도 이름이 올라가 있는 지원자가 포함된 경우를 의미합니다. 중복 신청 처리 방식에 대한 자세한 내용은 다음을 참조하십시오",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "이용 약관",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Ang Doorway sa pangkalahatan ay hindi tumatanggap ng mga duplicate na aplikasyon. Ang isang duplicate na aplikasyon ay isa na mayroong isang tao na lumilitaw din sa isa pang aplikasyon para sa parehong pagkakataon sa pabahay. Para sa mas detalyadong impormasyon sa kung paano namin pinangangasiwaan ang mga duplicate, tingnan ang aming",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "Mga Tuntunin ng Paggamit",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway thường không chấp nhận các đơn xin trùng lặp. Một đơn xin trùng lặp là đơn xin có người cũng xuất hiện trên một đơn xin khác cho cùng một cơ hội nhà ở. Để biết thông tin chi tiết hơn về cách chúng tôi xử lý các đơn xin trùng lặp, hãy xem của chúng tôi",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "Điều khoản sử dụng",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
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
            "duplicatesDetails": "Doorway 一般不接受重复申请。重复申请是指申请者与另一份申请者有相同的住房机会。有关我们如何处理重复申请的更多详细信息，请参阅我们的",
            "helpCenterUrl": "https://housingbayarea.mtc.ca.gov/faq",
            "notificationsUrl": "https://public.govdelivery.com/accounts/CAMTC/signup/36832",
            "termsOfUse": "使用条款",
            "termsUrl": "https://mtc.ca.gov/doorway-housing-portal-terms-use"
        }'::jsonb
    )
WHERE
    language = 'zh';