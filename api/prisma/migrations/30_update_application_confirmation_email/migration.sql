UPDATE translations
SET translations = jsonb_set(
    translations,
    '{t, seeListing}',
    '"See Listing"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, applicationsClosed}',
    '"Application <br />closed"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, applicationsRanked}',
    '"Application <br />ranked"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, applicationReceived}',
    '"Application <br />received"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, eligible}',
    '{
    "fcfs": "Applicants will be contacted on a first come first serve basis until vacancies are filled.",
    "lottery": "Once the application period closes, applicants will be placed in order based on lottery rank order.",
    "waitlist":"Applicants will be placed on the waitlist on a first come first serve basis until waitlist spots are filled.",
    "waitlistContact":"You may be contacted while on the waitlist to confirm that you wish to remain on the waitlist."
    }'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{leasingAgent}',
    '{
      "officeHours": "Office Hours:",
      "propertyManager": "Property Manager",
      "contactAgentToUpdateInfo": "If you need to update information on your application, do not apply again. Instead, contact the Property Agent for this listing."
    }') WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, gotYourConfirmationNumber}',
    '"We got your application for"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, interview}',
    '"If you are contacted for an interview, you will be asked to fill out a more detailed application and provide supporting documents."'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, needToMakeUpdates}',
    '"Need to make updates?"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, whatHappensNext}',
    '"What happens next?"'
    )
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{confirmation, yourConfirmationNumber}',
    '"Your Confirmation Number"'
    )
WHERE language = 'en';


INSERT INTO translations ( "updated_at","language", "translations", "jurisdiction_id") VALUES (CURRENT_TIMESTAMP,'es', 
'{
    "t": { "seeListing": "Ver listado" },
    "confirmation": {
      "applicationsClosed": "Solicitud <br />cerrada",
      "applicationsRanked": "Solicitud <br />clasificada",
      "applicationReceived": "Solicitud  <br />recibida",
      "interview": "Si lo contactan para una entrevista, se le pedirá que complete una solicitud más detallada y proporcione documentos de respaldo.",
      "needToMakeUpdates": "¿Necesitas realizar actualizaciones?",
      "eligible": {
        "fcfs": "Se contactará a los solicitantes por orden de llegada hasta que se cubran las vacantes.",
        "lottery": "Una vez finalizado el plazo de solicitud, los solicitantes se ordenarán según el orden de clasificación del sorteo.",
        "waitlist": "Los solicitantes se incluirán en la lista de espera por orden de llegada hasta que se cubran las plazas.",
        "waitlistContact": "Es posible que nos pongamos en contacto con usted mientras esté en la lista de espera para confirmar su deseo de permanecer en ella."
      },
      "gotYourConfirmationNumber": "Recibimos su solicitud para",
      "subject": "Confirmación de su solicitud",
      "whatHappensNext": "¿Qué pasa después?",
      "yourConfirmationNumber": "Su número de confirmación"
    },
    "leasingAgent": {
        "officeHours": "Horario de oficina:",
        "propertyManager": "Administrador de la propiedad",
        "contactAgentToUpdateInfo": "Si necesita actualizar la información de su solicitud, no la vuelva a solicitar. En su lugar, contacte al agente inmobiliario de este anuncio."
      }
  }', (Select id from jurisdictions where name='Detroit'));

INSERT INTO translations ( "updated_at","language", "translations", "jurisdiction_id") VALUES (CURRENT_TIMESTAMP,'ar', 
'{
    "t": { "seeListing": "انظر القائمة" },
    "confirmation": {
      "applicationsClosed": "تم إغلاق الطلب",
      "applicationsRanked": "تصنيف الطلب",
      "applicationReceived": "تم استلام الطلب",
      "interview": "إذا تم الاتصال بك لإجراء مقابلة، فسوف يُطلب منك ملء طلب أكثر تفصيلاً وتقديم المستندات الداعمة. ",
      "needToMakeUpdates": "هل تحتاج إلى إجراء تحديثات؟",
      "eligible": {
        "fcfs": "سيتم الاتصال بالمتقدمين على أساس أسبقية الحضور حتى يتم شغل الوظائف الشاغرة.",
        "lottery": "بمجرد إغلاق فترة تقديم الطلبات، سيتم ترتيب المتقدمين حسب ترتيب اليانصيب.",
        "waitlist": "سيتم وضع المتقدمين على قائمة الانتظار على أساس أسبقية الحضور حتى يتم ملء أماكن قائمة الانتظار.",
        "waitlistContact": "قد يتم الاتصال بك أثناء وجودك في قائمة الانتظار لتأكيد رغبتك في البقاء في قائمة الانتظار."
      },
      "gotYourConfirmationNumber": "لقد حصلنا على طلبك",
      "subject": "تأكيد طلبك",
      "whatHappensNext": "ماذا سيحدث بعد ذلك؟",
      "yourConfirmationNumber": "رقم التأكيد الخاص بك"
    },
    "leasingAgent": {
        "officeHours": "ساعات العمل:",
        "propertyManager": "مدير العقار",
        "contactAgentToUpdateInfo": "إذا كنت بحاجة إلى تحديث معلومات طلبك، فلا تتقدم بطلب جديد. بدلاً من ذلك، تواصل مع وكيل العقارات المسؤول عن هذا الإعلان."
      }
  }', (Select id from jurisdictions where name='Detroit'));

INSERT INTO translations ( "updated_at","language", "translations", "jurisdiction_id") VALUES (CURRENT_TIMESTAMP,'bn', 
'{
    "t": { "seeListing": "তালিকা দেখুন" },
    "confirmation": {
      "applicationsClosed": "আবেদন <br />বন্ধ",
      "applicationsRanked": "আবেদন <br />র‍্যাঙ্ক করা হয়েছে",
      "applicationReceived": "আবেদন <br />গৃহীত হয়েছে",
      "interview": "যদি আপনার সাথে সাক্ষাৎকারের জন্য যোগাযোগ করা হয়, তাহলে আপনাকে আরও বিস্তারিত আবেদনপত্র পূরণ করতে এবং সহায়ক নথি সরবরাহ করতে বলা হবে।",
      "needToMakeUpdates": "আপডেট করার প্রয়োজন?",
      "eligible": {
        "fcfs": "শূন্যপদ পূরণ না হওয়া পর্যন্ত আবেদনকারীদের সাথে আগে আসলে আগে পাবেন ভিত্তিতে যোগাযোগ করা হবে।",
        "lottery": "আবেদনের সময়সীমা শেষ হয়ে গেলে, লটারির র‍্যাঙ্ক ক্রমের ভিত্তিতে আবেদনকারীদের ক্রমানুসারে রাখা হবে।",
        "waitlist": "অপেক্ষা তালিকার আসন পূরণ না হওয়া পর্যন্ত আবেদনকারীদের আগে আসলে আগে পাবেন ভিত্তিতে অপেক্ষা তালিকায় রাখা হবে।",
        "waitlistContact": "অপেক্ষা তালিকায় থাকাকালীন আপনার সাথে যোগাযোগ করা হতে পারে এবং নিশ্চিত করা যেতে পারে যে আপনি অপেক্ষা তালিকায় থাকতে চান।"
      },
      "gotYourConfirmationNumber": "আমরা আপনার আবেদন পেয়েছি",
      "subject":"আপনার আবেদন নিশ্চিতকরণ",
      "whatHappensNext": "এরপর কী হবে?",
      "yourConfirmationNumber": "আপনার নিশ্চিতকরণ নম্বর"
    },
    "leasingAgent": {
        "officeHours": "অফিসের সময়:",
        "propertyManager": "সম্পত্তি ব্যবস্থাপক",
        "contactAgentToUpdateInfo": "যদি আপনার আবেদনের তথ্য আপডেট করার প্রয়োজন হয়, তাহলে আর আবেদন করবেন না। পরিবর্তে, এই তালিকার জন্য সম্পত্তি এজেন্টের সাথে যোগাযোগ করুন।"
      }
  }', (Select id from jurisdictions where name='Detroit'));
