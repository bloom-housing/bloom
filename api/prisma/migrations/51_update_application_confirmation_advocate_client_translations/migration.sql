-- Adds advocate-submission confirmation copy and client-safe confirmation copy.

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "Questions?",
          "gotYourConfirmationNumberOnYourBehalf": "We received an application on your behalf for"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "If you have questions regarding this application, please contact the agent for this listing."
    }'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "¿Preguntas?",
          "gotYourConfirmationNumberOnYourBehalf": "Recibimos una solicitud en su nombre para"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "Si tiene preguntas sobre esta aplicación, comuníquese con el agente de este listado."
    }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "Mga Tanong?",
          "gotYourConfirmationNumberOnYourBehalf": "Nakatanggap kami ng aplikasyon para sa iyo para sa"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "Kung mayroon kang mga katanungan tungkol sa aplikasyon na ito, mangyaring makipag-ugnayan sa ahente para sa listahang ito."
    }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "Có câu hỏi gì không?",
          "gotYourConfirmationNumberOnYourBehalf": "Chúng tôi đã nhận được đơn đăng ký thay mặt bạn cho"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "Nếu bạn có thắc mắc về đơn đăng ký này, vui lòng liên hệ với người đại diện phụ trách tin đăng."
    }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "问题？",
          "gotYourConfirmationNumberOnYourBehalf": "我们收到了一份代表您提交的申请"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "如果您对本申请有任何疑问，请联系该房源的代理人。"
    }'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "أسئلة؟",
          "gotYourConfirmationNumberOnYourBehalf": "لقد تلقينا طلبًا نيابةً عنك لـ"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "إذا كانت لديك أي أسئلة بخصوص هذا الطلب، فيرجى الاتصال بالوكيل المسؤول عن هذا الإعلان."
    }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "প্রশ্ন?",
          "gotYourConfirmationNumberOnYourBehalf": "আমরা আপনার পক্ষ থেকে একটি আবেদন পেয়েছি"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "এই আবেদন সম্পর্কে আপনার যদি কোন প্রশ্ন থাকে, তাহলে এই তালিকার জন্য এজেন্টের সাথে যোগাযোগ করুন।"
    }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "سوالات؟",
          "gotYourConfirmationNumberOnYourBehalf": "ما از طرف شما درخواستی دریافت کردیم برای"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "اگر در مورد این درخواست سوالی دارید، لطفاً با نماینده این آگهی تماس بگیرید."
    }'::jsonb
)
WHERE language = 'fa';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "질문?",
          "gotYourConfirmationNumberOnYourBehalf": "저희는 귀하를 대신하여 신청서를 접수했습니다."
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "본 신청서와 관련하여 궁금한 사항이 있으시면 해당 매물 담당자에게 문의해 주십시오."
    }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
    jsonb_set(
        translations,
        '{confirmation}',
        COALESCE(translations->'confirmation', '{}'::jsonb) || '{
          "questions": "Հարցեր՞",
          "gotYourConfirmationNumberOnYourBehalf": "Մենք Ձեր անունից դիմում ենք ստացել"
        }'::jsonb
    ),
    '{leasingAgent}',
    COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
      "contactAgentForQuestions": "Եթե ունեք հարցեր այս դիմումի վերաբերյալ, խնդրում ենք կապվել այս ցուցակի գործակալի հետ։"
    }'::jsonb
)
WHERE language = 'hy';
