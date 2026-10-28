-- Adds advocate and applicant specific confirmation copy.

UPDATE translations
SET translations = jsonb_set(
  jsonb_set(
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "Questions?",
        "gotYourConfirmationNumberOnYourBehalf": "We received an application on your behalf for",
        "interviewAdvocate": "If your client is contacted for an interview, they will be asked to fill out a more detailed application and provide supporting documents."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "Your client may be contacted while on the waitlist to confirm that they wish to remain on the waitlist."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "¿Preguntas?",
        "gotYourConfirmationNumberOnYourBehalf": "Recibimos una solicitud en su nombre para",
        "interviewAdvocate": "Si contactamos a su cliente para una entrevista, se le pedirá que complete una solicitud más detallada y proporcione documentos de respaldo."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "Es posible que nos comuniquemos con su cliente mientras esté en la lista de espera para confirmar que desea permanecer en la lista de espera."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "Mga Tanong?",
        "gotYourConfirmationNumberOnYourBehalf": "Nakatanggap kami ng aplikasyon para sa iyo para sa",
        "interviewAdvocate": "Kung ang iyong kliyente ay kokontakin para sa isang panayam, hihilingin sa kanila na punan ang isang mas detalyadong aplikasyon at magbigay ng mga sumusuportang dokumento."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "Maaaring kontakin ang iyong kliyente habang nasa waitlist upang kumpirmahin na nais nilang manatili sa waitlist."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "Có câu hỏi gì không?",
        "gotYourConfirmationNumberOnYourBehalf": "Chúng tôi đã nhận được đơn đăng ký thay mặt bạn cho",
        "interviewAdvocate": "Nếu khách hàng của bạn được liên hệ để phỏng vấn, họ sẽ được yêu cầu điền vào đơn xin việc chi tiết hơn và cung cấp các tài liệu hỗ trợ."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "Trong thời gian chờ đợi, khách hàng của bạn có thể được liên hệ để xác nhận lại việc họ có muốn tiếp tục nằm trong danh sách chờ hay không."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "问题？",
        "gotYourConfirmationNumberOnYourBehalf": "我们收到了一份代表您提交的申请",
        "interviewAdvocate": "如果您的客户接到面试通知，他们将被要求填写更详细的申请表并提供支持文件。"
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "您的客户在候补名单上期间，我们可能会联系他们以确认他们是否希望继续留在候补名单上。"
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "أسئلة؟",
        "gotYourConfirmationNumberOnYourBehalf": "لقد تلقينا طلبًا نيابةً عنك لـ",
        "interviewAdvocate": "إذا تم الاتصال بموكلك لإجراء مقابلة، فسيُطلب منه ملء طلب أكثر تفصيلاً وتقديم المستندات الداعمة."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "قد يتم الاتصال بعميلك أثناء وجوده على قائمة الانتظار للتأكد من رغبته في البقاء على قائمة الانتظار."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "প্রশ্ন?",
        "gotYourConfirmationNumberOnYourBehalf": "আমরা আপনার পক্ষ থেকে একটি আবেদন পেয়েছি",
        "interviewAdvocate": "যদি আপনার ক্লায়েন্টের সাথে সাক্ষাৎকারের জন্য যোগাযোগ করা হয়, তাহলে তাদের আরও বিস্তারিত আবেদনপত্র পূরণ করতে এবং সহায়ক নথি সরবরাহ করতে বলা হবে।"
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "আপনার ক্লায়েন্ট অপেক্ষা তালিকায় থাকাকালীন যোগাযোগ করা যেতে পারে যাতে তারা নিশ্চিত হতে পারে যে তারা অপেক্ষা তালিকায় থাকতে চান।"
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "سوالات؟",
        "gotYourConfirmationNumberOnYourBehalf": "ما از طرف شما درخواستی دریافت کردیم برای",
        "interviewAdvocate": "اگر با موکل شما برای مصاحبه تماس گرفته شود، از او خواسته می‌شود فرم درخواست دقیق‌تری را پر کند و مدارک پشتیبان را ارائه دهد."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "ممکن است در زمان حضور در لیست انتظار، با موکل شما تماس گرفته شود تا تأیید شود که مایل به ماندن در لیست انتظار است."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "질문?",
        "gotYourConfirmationNumberOnYourBehalf": "저희는 귀하를 대신하여 신청서를 접수했습니다.",
        "interviewAdvocate": "의뢰인이 인터뷰 요청을 받게 되면, 보다 자세한 신청서를 작성하고 관련 서류를 제출해야 합니다."
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "대기자 명단에 있는 고객에게 연락하여 대기자 명단에 계속 남아 있기를 원하는지 확인하는 절차를 거칠 수 있습니다."
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
    jsonb_set(
      translations,
      '{confirmation}',
      COALESCE(translations->'confirmation', '{}'::jsonb) || '{
        "questions": "Հարցեր՞",
        "gotYourConfirmationNumberOnYourBehalf": "Մենք Ձեր անունից դիմում ենք ստացել",
        "interviewAdvocate": "Եթե ձեր հաճախորդի հետ կապ հաստատեն հարցազրույցի համար, նրան կխնդրեն լրացնել ավելի մանրամասն դիմում և տրամադրել հիմնավորող փաստաթղթեր։"
      }'::jsonb
    ),
    '{confirmation,eligible}',
    COALESCE(translations->'confirmation'->'eligible', '{}'::jsonb) || '{
      "waitlistContactAdvocate": "Ձեր հաճախորդի հետ կարող են կապ հաստատել սպասման ցուցակում գտնվելու ընթացքում՝ հաստատելու համար, որ նա ցանկանում է մնալ սպասման ցուցակում։"
    }'::jsonb
  ),
  '{leasingAgent}',
  COALESCE(translations->'leasingAgent', '{}'::jsonb) || '{
    "contactAgentForQuestions": "Եթե ունեք հարցեր այս դիմումի վերաբերյալ, խնդրում ենք կապվել այս ցուցակի գործակալի հետ։"
  }'::jsonb
)
WHERE language = 'hy';
