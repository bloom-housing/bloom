UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryReleased}',
        '{
        "header": "Lottery results for %{listingName} are ready to be published",
        "adminApprovedStart":
          "Lottery results for %{listingName} have been released for publication. Please go to the listing view in your",
        "adminApprovedEnd":
          "to view the lottery tab and release the lottery results."
        }'
    )
WHERE
    language = 'en';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryPublished}',
        '{
        "header": "Lottery results have been published for %{listingName}",
        "resultsPublished": "Lottery results for %{listingName} have been published to applicant accounts."
        }'
    )
WHERE
    language = 'en';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        '{
        "header": "New Housing Lottery Results Available",
        "resultsAvailable":
          "Results are available for a housing lottery for %{listingName}. See your housing portal account for more information.",
        "signIn": "Sign In to View Your Results",
        "whatHappensHeader": "What happens next?",
        "whatHappensContent":
          "The property manager will contact applicants in rank order. If the property manager contacts you, they will ask you to provide documentation to support what you answered in the application. That documentation could include paystubs, for example. They might also need to gather more information by asking you to complete a supplemental application.",
        "otherOpportunities1":
          "To view other housing opportunities, please visit %{appUrl}. You can sign up to receive notifications of new application opportunities",
        "otherOpportunities2": "here",
        "otherOpportunities3":
          "If you want to learn about how lotteries work, please see the lottery section of the",
        "otherOpportunities4": "Housing Portal Help Center"
        }'
    )
WHERE
    language = 'en';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        '{
        "header": "Nuevos resultados de la lotería de vivienda disponibles",
        "resultsAvailable":
          "Los resultados están disponibles para una lotería de vivienda para %{listingName}. Consulte su cuenta del portal de vivienda para obtener más información.",
        "signIn": "Inicie sesión para ver sus resultados",
        "whatHappensHeader": "¿Qué pasa después?",
        "whatHappensContent":
          "El administrador de la propiedad se pondrá en contacto con los solicitantes por orden de preferencia. Si se pone en contacto con usted, le pedirá que proporcione documentación que respalde lo que respondió en la solicitud. Dicha documentación podría incluir, por ejemplo, recibos de sueldo. También podría solicitarle que complete una solicitud complementaria para obtener más información.",
        "otherOpportunities1":
          "Para ver otras oportunidades de vivienda, visite %{appUrl}. Puede registrarse para recibir notificaciones de nuevas oportunidades de solicitud",
        "otherOpportunities2": "aquí",
        "otherOpportunities3":
          "Si desea obtener información sobre cómo funcionan las loterías, consulte la sección de lotería del",
        "otherOpportunities4": "Housing Portal Centro de ayuda"
        }'
    )
WHERE
    language = 'es';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        '{
        "header": "نتائج يانصيب الإسكان الجديدة متاحة الآن",
        "resultsAvailable":
          "النتائج متاحة الآن ليانصيب الإسكان لـ %{listingName}. راجع حساب بوابة الإسكان الخاصة بك لمزيد من المعلومات.",
        "signIn": "تسجيل الدخول لعرض نتائجك",
        "whatHappensHeader": "ماذا سيحدث بعد ذلك؟",
        "whatHappensContent":
          "سيتواصل مدير العقار مع المتقدمين حسب ترتيبهم. إذا تواصل معك، فسيطلب منك تقديم مستندات تدعم إجاباتك في الطلب. قد تشمل هذه المستندات كشوف رواتب، على سبيل المثال. قد يطلب منك أيضًا تعبئة طلب إضافي لجمع معلومات إضافية.",
        "otherOpportunities1":
          "للاطلاع على فرص السكن الأخرى، يُرجى زيارة %{appUrl}. يمكنك التسجيل لتلقي إشعارات بفرص التقديم الجديدة.",
        "otherOpportunities2": "هنا",
        "otherOpportunities3":
          "إذا كنت تريد التعرف على كيفية عمل اليانصيب، يرجى الاطلاع على قسم اليانصيب في",
        "otherOpportunities4": "مركز مساعدة بوابة الإسكان"
        }'
    )
WHERE
    language = 'ar';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{lotteryAvailable}',
        '{
        "header": "নতুন হাউজিং লটারির ফলাফল পাওয়া যাচ্ছে",
        "resultsAvailable":
          "%{listingName} এর জন্য একটি আবাসন লটারির ফলাফল পাওয়া যাচ্ছে। আরও তথ্যের জন্য আপনার আবাসন পোর্টাল অ্যাকাউন্টটি দেখুন।",
        "signIn": "আপনার ফলাফল দেখতে সাইন ইন করুন",
        "whatHappensHeader": "এরপর কি হবে?",
        "whatHappensContent":
          "সম্পত্তি ব্যবস্থাপক আবেদনকারীদের সাথে র‍্যাঙ্ক ক্রমানুসারে যোগাযোগ করবেন। যদি সম্পত্তি ব্যবস্থাপক আপনার সাথে যোগাযোগ করেন, তাহলে তারা আপনাকে আবেদনপত্রে আপনি যা উত্তর দিয়েছেন তা সমর্থন করার জন্য নথিপত্র সরবরাহ করতে বলবেন। উদাহরণস্বরূপ, সেই নথিপত্রে বেতনের টাকা অন্তর্ভুক্ত থাকতে পারে। আপনাকে একটি সম্পূরক আবেদনপত্র পূরণ করতে বলে তাদের আরও তথ্য সংগ্রহের প্রয়োজন হতে পারে।",
        "otherOpportunities1":
          "অন্যান্য আবাসন সুযোগ দেখতে, অনুগ্রহ করে %{appUrl} দেখুন। নতুন আবেদনের সুযোগের বিজ্ঞপ্তি পেতে আপনি সাইন আপ করতে পারেন।",
        "otherOpportunities2": "এখানে",
        "otherOpportunities3":
          "লটারি কীভাবে কাজ করে তা জানতে চাইলে, অনুগ্রহ করে লটারি বিভাগটি দেখুন",
        "otherOpportunities4": "হাউজিং পোর্টাল সহায়তা কেন্দ্র"
        }'
    )
WHERE
    language = 'bn';