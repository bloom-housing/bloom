-- Adds application update email translations.
UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "Application update for %{listingName}",
    "title": "Your application has been updated for %{listingName}",
    "greeting": "Hello",
    "updateNotice": "An update has been made to your housing application for %{listingName}.",
    "summaryTitle": "Summary of changes:",
    "statusChange": "Your application status has changed from %{from} to %{to}",
    "accessibleWaitListChange": "Your Accessible wait list number is %{value}",
    "conventionalWaitListChange": "Your Conventional wait list number is %{value}",
    "statusLabel": "Application status",
    "contactNotice": "No further action is required at this time. If you have questions regarding this update, please reach out at",
    "viewPrompt": "To view your application, please click the link below:",
    "viewLink": "View my application"
    "applicationStatus": {
      "submitted": "Submitted",
      "declined": "Declined",
      "receivedUnit": "Received a unit"
      "waitlist": "Wait list",
      "waitlistDeclined": "Wait list - Declined",
    },
    }'
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "Actualización de la aplicación para %{listingName}",
    "title": "Su aplicación ha sido actualizada para %{listingName}",
    "greeting": "Hola",
    "updateNotice": "Se ha realizado una actualización en su solicitud de vivienda para %{listingName}.",
    "summaryTitle": "Resumen de cambios:",
    "statusChange": "El estado de su solicitud ha cambiado de %{from} a %{to}",
    "accessibleWaitListChange": "Su número de lista de espera accesible es %{value}",
    "conventionalWaitListChange": "Su número de lista de espera convencional es %{value}",
    "statusLabel": "Estado de la solicitud",
    "contactNotice": "No se requiere ninguna acción adicional en este momento. Si tiene alguna pregunta sobre esta actualización, comuníquese con nosotros en",
    "viewPrompt": "Para ver su solicitud, haga clic en el siguiente enlace:",
    "viewLink": "Ver mi solicitud",
    "applicationStatus": {
      "submitted": "Enviada",
      "declined": "Rechazada",
      "receivedUnit": "Unidad recibida",
      "waitlist": "Lista de espera",
      "waitlistDeclined": "Lista de espera - Rechazada",
    },
    }'
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "Pag-update ng aplikasyon para sa %{listingName}",
    "title": "Na-update na ang iyong aplikasyon para sa %{listingName}",
    "greeting": "Kumusta",
    "updateNotice": "May ginawang update sa iyong aplikasyon sa pabahay para sa %{listingName}.",
    "summaryTitle": "Buod ng mga pagbabago:",
    "statusChange": "Nagbago ang katayuan ng iyong aplikasyon mula %{from} patungong %{to}",
    "accessibleWaitListChange": "Ang numero ng iyong wait list sa Accessible ay %{value}",
    "conventionalWaitListChange": "Ang iyong karaniwang numero ng wait list ay %{value}",
    "statusLabel": "Katayuan ng aplikasyon",
    "contactNotice": "Wala nang karagdagang aksyon na kinakailangan sa ngayon. Kung mayroon kang mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa",
    "viewPrompt": "Para makita ang iyong aplikasyon, paki-click ang link sa ibaba:",
    "viewLink": "Tingnan ang aking aplikasyon",
    "applicationStatus": {
      "submitted": "Isinumite",
      "declined": "Tinanggihan",
      "receivedUnit": "Nakatanggap ng unit",
      "waitlist": "Waitlist",
      "waitlistDeclined": "Waitlist - Tinanggihan",
    },
    }'
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "Cập nhật ứng dụng cho %{listingName}",
    "title": "Ứng dụng của bạn đã được cập nhật cho %{listingName}",
    "greeting": "Xin chào",
    "updateNotice": "Đã có bản cập nhật cho đơn đăng ký nhà ở của bạn tại %{listingName}.",
    "summaryTitle": "Tóm tắt các thay đổi:",
    "statusChange": "Trạng thái hồ sơ của bạn đã thay đổi từ %{from} thành %{to}",
    "accessibleWaitListChange": "Số thứ tự trong danh sách chờ dành cho người khuyết tật của bạn là %{value}",
    "conventionalWaitListChange": "Số thứ tự trong danh sách chờ thông thường của bạn là %{value}",
    "statusLabel": "Trạng thái ứng dụng",
    "contactNotice": "Hiện tại không cần thực hiện thêm bất kỳ hành động nào. Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:",
    "viewPrompt": "Để xem hồ sơ ứng tuyển của bạn, vui lòng nhấp vào liên kết bên dưới:",
    "viewLink": "Xem đơn đăng ký của tôi",
    "applicationStatus": {
      "submitted": "Đã gửi",
      "declined": "Đã từ chối",
      "receivedUnit": "Đã nhận đơn vị",
      "waitlist": "Danh sách chờ",
      "waitlistDeclined": "Danh sách chờ - Đã từ chối",
    },
    }'
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "%{listingName} 的应用程序更新",
    "title": "您的申请已更新至 %{listingName}",
    "greeting": "你好",
    "updateNotice": "您的房屋申请（房源名称：%{listingName}）已更新。",
    "summaryTitle": "变更摘要：",
    "statusChange": "您的申请状态已从 %{from} 更改为 %{to}",
    "accessibleWaitListChange": "您的无障碍候补名单编号为 %{value}",
    "conventionalWaitListChange": "您的常规候补名单编号为 %{value}",
    "statusLabel": "应用程序状态",
    "contactNotice": "目前无需采取任何进一步行动。如果您对此更新有任何疑问，请联系我们。",
    "viewPrompt": "要查看您的申请，请点击以下链接：",
    "viewLink": "查看我的申请",
    "applicationStatus": {
      "submitted": "已提交",
      "declined": "已拒絕",
      "receivedUnit": "已獲配單位",
      "waitlist": "候補名單",
      "waitlistDeclined": "候補名單 - 已拒絕",
    },
    }'
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "تحديث الطلب لـ %{listingName}",
    "title": "تم تحديث طلبك لـ %{listingName}",
    "greeting": "مرحبًا",
    "updateNotice": "تم تحديث طلب السكن الخاص بك لـ %{listingName}.",
    "summaryTitle": "ملخص التغييرات:",
    "statusChange": "لقد تغيرت حالة طلبك من %{from} إلى %{to}",
    "accessibleWaitListChange": "رقمك في قائمة انتظار ذوي الاحتياجات الخاصة هو %{value}",
    "conventionalWaitListChange": "رقمك في قائمة الانتظار التقليدية هو %{value}",
    "statusLabel": "حالة الطلب",
    "contactNotice": "لا يلزم اتخاذ أي إجراء إضافي في الوقت الحالي. إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يُرجى التواصل معنا على",
    "viewPrompt": "للاطلاع على طلبك، يرجى النقر على الرابط أدناه:",
    "viewLink": "اطلع على طلبي",
    "applicationStatus": {
      "submitted": "تم التقديم",
      "declined": "مرفوض",
      "receivedUnit": "استلم وحدة",
      "waitlist": "قائمة الانتظار",
      "waitlistDeclined": "قائمة الانتظار - مرفوض",
    },
    }'
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
    translations,
    '{applicationUpdate}',
    '{
    "subject": "%{listingName} এর জন্য অ্যাপ্লিকেশন আপডেট",
    "title": "আপনার অ্যাপ্লিকেশনটি %{listingName} এর জন্য আপডেট করা হয়েছে।",
    "greeting": "হ্যালো",
    "updateNotice": "%{listingName} এর জন্য আপনার আবাসন আবেদনে একটি আপডেট করা হয়েছে।",
    "summaryTitle": "পরিবর্তনের সারসংক্ষেপ:",
    "statusChange": "আপনার আবেদনের স্থিতি %{from} থেকে %{to} এ পরিবর্তিত হয়েছে।",
    "accessibleWaitListChange": "আপনার অ্যাক্সেসযোগ্য অপেক্ষা তালিকার নম্বর হল %{value}",
    "conventionalWaitListChange": "আপনার প্রচলিত অপেক্ষা তালিকার নম্বর হল %{value}",
    "statusLabel": "আবেদনের স্থিতি",
    "contactNotice": "এই মুহূর্তে আর কোনও পদক্ষেপ নেওয়ার প্রয়োজন নেই। এই আপডেট সম্পর্কে আপনার যদি কোনও প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন:",
    "viewPrompt": "আপনার আবেদনপত্রটি দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:",
    "viewLink": "আমার আবেদন দেখুন",
    "applicationStatus": {
      "submitted": "জমা দেওয়া হয়েছে",
      "declined": "প্রত্যাখ্যান করা হয়েছে",
      "receivedUnit": "একটি ইউনিট পেয়েছি",
      "waitlist": "অপেক্ষা তালিকা",
      "waitlistDeclined": "অপেক্ষা তালিকা - প্রত্যাখ্যান করা হয়েছে",
    },
    }'
)
WHERE language = 'bn';