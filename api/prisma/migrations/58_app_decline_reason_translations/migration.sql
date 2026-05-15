-- en
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Your application decline reason is %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"Household income too high","householdIncomeTooLow":"Household income too low","householdSizeTooLarge":"Household size too large","householdSizeTooSmall":"Household size too small","attemptedToContactNoResponse":"Attempted to contact; no response","applicantDeclinedUnit":"Applicant declined unit","doesNotMeetSeniorBuildingRequirement":"Does not meet senior building requirement","householdDoesNotNeedAccessibleUnit":"Household does not need accessible unit features","other":"Other"}'::jsonb, true)
  WHERE language = 'en' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'en',
  '{"applicationUpdate":{"subject":"Application update for %{listingName}","title":"Your application has been updated for %{listingName}","greeting":"Hello","updateNotice":"An update has been made to your housing application for %{listingName}.","summaryTitle":"Summary of changes:","statusChange":"Your application status has changed from %{from} to %{to}","accessibleWaitListChange":"Your Accessible wait list number is %{value}","conventionalWaitListChange":"Your Conventional wait list number is %{value}","statusLabel":"Application status","contactNotice":"No further action is required at this time. If you have questions regarding this update, please reach out at","viewPrompt":"To view your application, please click the link below:","viewLink":"View my application","applicationStatus":{"submitted":"Submitted","declined":"Declined","receivedUnit":"Received a unit","waitlist":"Wait list","waitlistDeclined":"Wait list - Declined"},"applicantContactNotice":"If you have questions regarding this update, please reach out at","advocateUpdateNotice":"An update has been made to the housing application you submitted on behalf of %{applicantName} for %{listingName}.","advocateViewPrompt":"To view your client''s application, please click the link below:","advocateViewLink":"View application","declineReasonChange":"Your application decline reason is %{value}","declineReason":{"householdIncomeTooHigh":"Household income too high","householdIncomeTooLow":"Household income too low","householdSizeTooLarge":"Household size too large","householdSizeTooSmall":"Household size too small","attemptedToContactNoResponse":"Attempted to contact; no response","applicantDeclinedUnit":"Applicant declined unit","doesNotMeetSeniorBuildingRequirement":"Does not meet senior building requirement","householdDoesNotNeedAccessibleUnit":"Household does not need accessible unit features","other":"Other"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- es
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"El motivo del rechazo de su solicitud es %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"Los ingresos familiares son demasiado altos.","householdIncomeTooLow":"Los ingresos familiares son demasiado bajos.","householdSizeTooLarge":"El tamaño de la vivienda es demasiado grande.","householdSizeTooSmall":"El tamaño de la vivienda es demasiado pequeño","attemptedToContactNoResponse":"Se intentó contactar; no hubo respuesta.","applicantDeclinedUnit":"El solicitante rechazó la unidad.","doesNotMeetSeniorBuildingRequirement":"No cumple con los requisitos del edificio para personas mayores","householdDoesNotNeedAccessibleUnit":"El hogar no necesita características de accesibilidad en la unidad.","other":"Otro"}'::jsonb, true)
  WHERE language = 'es' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'es',
  '{"applicationUpdate":{"subject":"Actualización de la aplicación para %{listingName}","title":"Su aplicación ha sido actualizada para %{listingName}","greeting":"Hola","updateNotice":"Se ha realizado una actualización en su solicitud de vivienda para %{listingName}.","summaryTitle":"Resumen de cambios:","statusChange":"El estado de su solicitud ha cambiado de %{from} a %{to}","accessibleWaitListChange":"Su número de lista de espera accesible es %{value}","conventionalWaitListChange":"Su número de lista de espera convencional es %{value}","statusLabel":"Estado de la solicitud","contactNotice":"No se requiere ninguna acción adicional en este momento. Si tiene alguna pregunta sobre esta actualización, comuníquese con nosotros en","viewPrompt":"Para ver su solicitud, haga clic en el siguiente enlace:","viewLink":"Ver mi solicitud","applicationStatus":{"submitted":"Enviada","declined":"Rechazada","receivedUnit":"Unidad recibida","waitlist":"Lista de espera","waitlistDeclined":"Lista de espera - Rechazada"},"applicantContactNotice":"Si tiene preguntas sobre esta actualización, comuníquese con nosotros en","advocateUpdateNotice":"Se ha realizado una actualización a la solicitud de vivienda que envió en nombre de %{applicantName} para %{listingName}.","advocateViewPrompt":"Para ver la solicitud de su cliente, haga clic en el siguiente enlace:","advocateViewLink":"Ver aplicación","declineReasonChange":"El motivo del rechazo de su solicitud es %{value}","declineReason":{"householdIncomeTooHigh":"Los ingresos familiares son demasiado altos.","householdIncomeTooLow":"Los ingresos familiares son demasiado bajos.","householdSizeTooLarge":"El tamaño de la vivienda es demasiado grande.","householdSizeTooSmall":"El tamaño de la vivienda es demasiado pequeño","attemptedToContactNoResponse":"Se intentó contactar; no hubo respuesta.","applicantDeclinedUnit":"El solicitante rechazó la unidad.","doesNotMeetSeniorBuildingRequirement":"No cumple con los requisitos del edificio para personas mayores","householdDoesNotNeedAccessibleUnit":"El hogar no necesita características de accesibilidad en la unidad.","other":"Otro"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- tl
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Ang dahilan ng pagtanggi sa iyong aplikasyon ay %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"Masyadong mataas ang kita ng sambahayan","householdIncomeTooLow":"Masyadong mababa ang kita ng sambahayan","householdSizeTooLarge":"Masyadong malaki ang laki ng sambahayan","householdSizeTooSmall":"Masyadong maliit ang laki ng sambahayan","attemptedToContactNoResponse":"Sinubukan kong kontakin; walang tugon","applicantDeclinedUnit":"Yunit na tinanggihan ng aplikante","doesNotMeetSeniorBuildingRequirement":"Hindi nakakatugon sa kinakailangan sa gusali para sa mga matatanda","householdDoesNotNeedAccessibleUnit":"Hindi kailangan ng sambahayan ang mga accessible unit features","other":"Iba pa"}'::jsonb, true)
  WHERE language = 'tl' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'tl',
  '{"applicationUpdate":{"subject":"Pag-update ng aplikasyon para sa %{listingName}","title":"Na-update na ang iyong aplikasyon para sa %{listingName}","greeting":"Kumusta","updateNotice":"May ginawang update sa iyong aplikasyon sa pabahay para sa %{listingName}.","summaryTitle":"Buod ng mga pagbabago:","statusChange":"Nagbago ang katayuan ng iyong aplikasyon mula %{from} patungong %{to}","accessibleWaitListChange":"Ang numero ng iyong wait list sa Accessible ay %{value}","conventionalWaitListChange":"Ang iyong karaniwang numero ng wait list ay %{value}","statusLabel":"Katayuan ng aplikasyon","contactNotice":"Wala nang karagdagang aksyon na kinakailangan sa ngayon. Kung mayroon kang mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa","viewPrompt":"Para makita ang iyong aplikasyon, paki-click ang link sa ibaba:","viewLink":"Tingnan ang aking aplikasyon","applicationStatus":{"submitted":"Isinumite","declined":"Tinanggihan","receivedUnit":"Nakatanggap ng unit","waitlist":"Waitlist","waitlistDeclined":"Waitlist - Tinanggihan"},"applicantContactNotice":"Kung mayroon kayong mga katanungan tungkol sa update na ito, mangyaring makipag-ugnayan sa","advocateUpdateNotice":"May ginawang update sa aplikasyon para sa pabahay na isinumite mo sa ngalan ni %{applicantName} para sa %{listingName}.","advocateViewPrompt":"Para makita ang aplikasyon ng inyong kliyente, paki-click ang link sa ibaba:","advocateViewLink":"Tingnan ang aplikasyon","declineReasonChange":"Ang dahilan ng pagtanggi sa iyong aplikasyon ay %{value}","declineReason":{"householdIncomeTooHigh":"Masyadong mataas ang kita ng sambahayan","householdIncomeTooLow":"Masyadong mababa ang kita ng sambahayan","householdSizeTooLarge":"Masyadong malaki ang laki ng sambahayan","householdSizeTooSmall":"Masyadong maliit ang laki ng sambahayan","attemptedToContactNoResponse":"Sinubukan kong kontakin; walang tugon","applicantDeclinedUnit":"Yunit na tinanggihan ng aplikante","doesNotMeetSeniorBuildingRequirement":"Hindi nakakatugon sa kinakailangan sa gusali para sa mga matatanda","householdDoesNotNeedAccessibleUnit":"Hindi kailangan ng sambahayan ang mga accessible unit features","other":"Iba pa"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- vi
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Lý do từ chối đơn đăng ký của bạn là %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"Thu nhập hộ gia đình quá cao","householdIncomeTooLow":"Thu nhập hộ gia đình quá thấp","householdSizeTooLarge":"Quy mô hộ gia đình quá lớn","householdSizeTooSmall":"Quy mô hộ gia đình quá nhỏ","attemptedToContactNoResponse":"Đã cố gắng liên lạc; không nhận được phản hồi.","applicantDeclinedUnit":"Người nộp đơn đã từ chối căn hộ.","doesNotMeetSeniorBuildingRequirement":"Không đáp ứng yêu cầu của tòa nhà dành cho người cao tuổi.","householdDoesNotNeedAccessibleUnit":"Hộ gia đình không cần các tiện nghi dành cho người khuyết tật.","other":"Khác"}'::jsonb, true)
  WHERE language = 'vi' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'vi',
  '{"applicationUpdate":{"subject":"Cập nhật ứng dụng cho %{listingName}","title":"Ứng dụng của bạn đã được cập nhật cho %{listingName}","greeting":"Xin chào","updateNotice":"Đã có bản cập nhật cho đơn đăng ký nhà ở của bạn tại %{listingName}.","summaryTitle":"Tóm tắt các thay đổi:","statusChange":"Trạng thái hồ sơ của bạn đã thay đổi từ %{from} thành %{to}","accessibleWaitListChange":"Số thứ tự trong danh sách chờ dành cho người khuyết tật của bạn là %{value}","conventionalWaitListChange":"Số thứ tự trong danh sách chờ thông thường của bạn là %{value}","statusLabel":"Trạng thái ứng dụng","contactNotice":"Hiện tại không cần thực hiện thêm bất kỳ hành động nào. Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:","viewPrompt":"Để xem hồ sơ ứng tuyển của bạn, vui lòng nhấp vào liên kết bên dưới:","viewLink":"Xem đơn đăng ký của tôi","applicationStatus":{"submitted":"Đã gửi","declined":"Đã từ chối","receivedUnit":"Đã nhận đơn vị","waitlist":"Danh sách chờ","waitlistDeclined":"Danh sách chờ - Đã từ chối"},"applicantContactNotice":"Nếu bạn có thắc mắc về bản cập nhật này, vui lòng liên hệ theo địa chỉ sau:","advocateUpdateNotice":"Đã có bản cập nhật cho đơn xin nhà ở mà bạn đã nộp thay mặt cho %{applicantName} tại %{listingName}.","advocateViewPrompt":"Để xem hồ sơ ứng tuyển của khách hàng, vui lòng nhấp vào liên kết bên dưới:","advocateViewLink":"Xem ứng dụng","declineReasonChange":"Lý do từ chối đơn đăng ký của bạn là %{value}","declineReason":{"householdIncomeTooHigh":"Thu nhập hộ gia đình quá cao","householdIncomeTooLow":"Thu nhập hộ gia đình quá thấp","householdSizeTooLarge":"Quy mô hộ gia đình quá lớn","householdSizeTooSmall":"Quy mô hộ gia đình quá nhỏ","attemptedToContactNoResponse":"Đã cố gắng liên lạc; không nhận được phản hồi.","applicantDeclinedUnit":"Người nộp đơn đã từ chối căn hộ.","doesNotMeetSeniorBuildingRequirement":"Không đáp ứng yêu cầu của tòa nhà dành cho người cao tuổi.","householdDoesNotNeedAccessibleUnit":"Hộ gia đình không cần các tiện nghi dành cho người khuyết tật.","other":"Khác"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- zh
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"您的申请被拒原因是 %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"家庭收入过高","householdIncomeTooLow":"家庭收入过低","householdSizeTooLarge":"家庭规模过大","householdSizeTooSmall":"家庭规模太小","attemptedToContactNoResponse":"尝试联系，但未收到回复","applicantDeclinedUnit":"申请人拒绝了该单元","doesNotMeetSeniorBuildingRequirement":"不符合高级建筑要求","householdDoesNotNeedAccessibleUnit":"家庭不需要无障碍单元功能","other":"其他"}'::jsonb, true)
  WHERE language = 'zh' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'zh',
  '{"applicationUpdate":{"subject":"%{listingName} 的应用程序更新","title":"您的申请已更新至 %{listingName}","greeting":"你好","updateNotice":"您的房屋申请（房源名称：%{listingName}）已更新。","summaryTitle":"变更摘要：","statusChange":"您的申请状态已从 %{from} 更改为 %{to}","accessibleWaitListChange":"您的无障碍候补名单编号为 %{value}","conventionalWaitListChange":"您的常规候补名单编号为 %{value}","statusLabel":"应用程序状态","contactNotice":"目前无需采取任何进一步行动。如果您对此更新有任何疑问，请联系我们。","viewPrompt":"要查看您的申请，请点击以下链接：","viewLink":"查看我的申请","applicationStatus":{"submitted":"已提交","declined":"已拒絕","receivedUnit":"已獲配單位","waitlist":"候補名單","waitlistDeclined":"候補名單 - 已拒絕"},"applicantContactNotice":"如果您对本次更新有任何疑问，请联系我们。","advocateUpdateNotice":"您代表 %{applicantName} 提交的关于 %{listingName} 的住房申请已更新。","advocateViewPrompt":"要查看您客户的申请，请点击以下链接：","advocateViewLink":"查看应用程序","declineReasonChange":"您的申请被拒原因是 %{value}","declineReason":{"householdIncomeTooHigh":"家庭收入过高","householdIncomeTooLow":"家庭收入过低","householdSizeTooLarge":"家庭规模过大","householdSizeTooSmall":"家庭规模太小","attemptedToContactNoResponse":"尝试联系，但未收到回复","applicantDeclinedUnit":"申请人拒绝了该单元","doesNotMeetSeniorBuildingRequirement":"不符合高级建筑要求","householdDoesNotNeedAccessibleUnit":"家庭不需要无障碍单元功能","other":"其他"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- ar
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"سبب رفض طلبك هو %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"دخل الأسرة مرتفع للغاية","householdIncomeTooLow":"دخل الأسرة منخفض للغاية","householdSizeTooLarge":"حجم الأسرة كبير جدًا","householdSizeTooSmall":"حجم الأسرة صغير جدًا","attemptedToContactNoResponse":"تمت محاولة الاتصال؛ لم يتم الرد","applicantDeclinedUnit":"رفض مقدم الطلب الوحدة","doesNotMeetSeniorBuildingRequirement":"لا يفي بمتطلبات المباني لكبار السن","householdDoesNotNeedAccessibleUnit":"لا يحتاج المنزل إلى ميزات وحدة يسهل الوصول إليها","other":"آخر"}'::jsonb, true)
  WHERE language = 'ar' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'ar',
  '{"applicationUpdate":{"subject":"تحديث الطلب لـ %{listingName}","title":"تم تحديث طلبك لـ %{listingName}","greeting":"مرحبًا","updateNotice":"تم تحديث طلب السكن الخاص بك لـ %{listingName}.","summaryTitle":"ملخص التغييرات:","statusChange":"لقد تغيرت حالة طلبك من %{from} إلى %{to}","accessibleWaitListChange":"رقمك في قائمة انتظار ذوي الاحتياجات الخاصة هو %{value}","conventionalWaitListChange":"رقمك في قائمة الانتظار التقليدية هو %{value}","statusLabel":"حالة الطلب","contactNotice":"لا يلزم اتخاذ أي إجراء إضافي في الوقت الحالي. إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يُرجى التواصل معنا على","viewPrompt":"للاطلاع على طلبك، يرجى النقر على الرابط أدناه:","viewLink":"اطلع على طلبي","applicationStatus":{"submitted":"تم التقديم","declined":"مرفوض","receivedUnit":"استلم وحدة","waitlist":"قائمة الانتظار","waitlistDeclined":"قائمة الانتظار - مرفوض"},"applicantContactNotice":"إذا كانت لديكم أي استفسارات بخصوص هذا التحديث، يرجى التواصل معنا على","advocateUpdateNotice":"تم تحديث طلب السكن الذي قدمته نيابة عن %{applicantName} لـ %{listingName}.","advocateViewPrompt":"للاطلاع على طلب عميلك، يرجى النقر على الرابط أدناه:","advocateViewLink":"عرض الطلب","declineReasonChange":"سبب رفض طلبك هو %{value}","declineReason":{"householdIncomeTooHigh":"دخل الأسرة مرتفع للغاية","householdIncomeTooLow":"دخل الأسرة منخفض للغاية","householdSizeTooLarge":"حجم الأسرة كبير جدًا","householdSizeTooSmall":"حجم الأسرة صغير جدًا","attemptedToContactNoResponse":"تمت محاولة الاتصال؛ لم يتم الرد","applicantDeclinedUnit":"رفض مقدم الطلب الوحدة","doesNotMeetSeniorBuildingRequirement":"لا يفي بمتطلبات المباني لكبار السن","householdDoesNotNeedAccessibleUnit":"لا يحتاج المنزل إلى ميزات وحدة يسهل الوصول إليها","other":"آخر"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- bn
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"আপনার আবেদন প্রত্যাখ্যানের কারণ হল %{value}"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"পারিবারিক আয় খুব বেশি","householdIncomeTooLow":"পারিবারিক আয় খুব কম","householdSizeTooLarge":"পরিবারের আকার খুব বড়","householdSizeTooSmall":"পরিবারের আকার খুব ছোট","attemptedToContactNoResponse":"যোগাযোগের চেষ্টা করা হয়েছে; কোনো সাড়া পাওয়া যায়নি।","applicantDeclinedUnit":"আবেদনকারী ইউনিটটি প্রত্যাখ্যান করেছেন","doesNotMeetSeniorBuildingRequirement":"সিনিয়র বিল্ডিংয়ের প্রয়োজনীয়তা পূরণ করে না","householdDoesNotNeedAccessibleUnit":"পরিবারের জন্য প্রবেশযোগ্য ইউনিটের বৈশিষ্ট্যের প্রয়োজন নেই।","other":"অন্যান্য"}'::jsonb, true)
  WHERE language = 'bn' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'bn',
  '{"applicationUpdate":{"subject":"%{listingName} এর জন্য অ্যাপ্লিকেশন আপডেট","title":"আপনার অ্যাপ্লিকেশনটি %{listingName} এর জন্য আপডেট করা হয়েছে।","greeting":"হ্যালো","updateNotice":"%{listingName} এর জন্য আপনার আবাসন আবেদনে একটি আপডেট করা হয়েছে।","summaryTitle":"পরিবর্তনের সারসংক্ষেপ:","statusChange":"আপনার আবেদনের স্থিতি %{from} থেকে %{to} এ পরিবর্তিত হয়েছে।","accessibleWaitListChange":"আপনার অ্যাক্সেসযোগ্য অপেক্ষা তালিকার নম্বর হল %{value}","conventionalWaitListChange":"আপনার প্রচলিত অপেক্ষা তালিকার নম্বর হল %{value}","statusLabel":"আবেদনের স্থিতি","contactNotice":"এই মুহূর্তে আর কোনও পদক্ষেপ নেওয়ার প্রয়োজন নেই। এই আপডেট সম্পর্কে আপনার যদি কোনও প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন:","viewPrompt":"আপনার আবেদনপত্রটি দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:","viewLink":"আমার আবেদন দেখুন","applicationStatus":{"submitted":"জমা দেওয়া হয়েছে","declined":"প্রত্যাখ্যান করা হয়েছে","receivedUnit":"একটি ইউনিট পেয়েছি","waitlist":"অপেক্ষা তালিকা","waitlistDeclined":"অপেক্ষা তালিকা - প্রত্যাখ্যান করা হয়েছে"},"applicantContactNotice":"এই আপডেট সম্পর্কে আপনার যদি কোন প্রশ্ন থাকে, তাহলে অনুগ্রহ করে যোগাযোগ করুন","advocateUpdateNotice":"%{applicantName} এর পক্ষ থেকে %{listingName} এর জন্য আপনার জমা দেওয়া আবাসন আবেদনের একটি আপডেট করা হয়েছে।","advocateViewPrompt":"আপনার ক্লায়েন্টের আবেদন দেখতে, অনুগ্রহ করে নীচের লিঙ্কে ক্লিক করুন:","advocateViewLink":"আবেদন দেখুন","declineReasonChange":"আপনার আবেদন প্রত্যাখ্যানের কারণ হল %{value}","declineReason":{"householdIncomeTooHigh":"পারিবারিক আয় খুব বেশি","householdIncomeTooLow":"পারিবারিক আয় খুব কম","householdSizeTooLarge":"পরিবারের আকার খুব বড়","householdSizeTooSmall":"পরিবারের আকার খুব ছোট","attemptedToContactNoResponse":"যোগাযোগের চেষ্টা করা হয়েছে; কোনো সাড়া পাওয়া যায়নি।","applicantDeclinedUnit":"আবেদনকারী ইউনিটটি প্রত্যাখ্যান করেছেন","doesNotMeetSeniorBuildingRequirement":"সিনিয়র বিল্ডিংয়ের প্রয়োজনীয়তা পূরণ করে না","householdDoesNotNeedAccessibleUnit":"পরিবারের জন্য প্রবেশযোগ্য ইউনিটের বৈশিষ্ট্যের প্রয়োজন নেই।","other":"অন্যান্য"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- ko
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"귀하의 지원서가 거절된 이유는 %{value}입니다."'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"가계 소득이 너무 높음","householdIncomeTooLow":"가계 소득이 너무 낮음","householdSizeTooLarge":"가구 규모가 너무 큽니다","householdSizeTooSmall":"가구 규모가 너무 작습니다","attemptedToContactNoResponse":"연락을 시도했으나 응답이 없었습니다.","applicantDeclinedUnit":"지원자가 해당 부서를 거부했습니다.","doesNotMeetSeniorBuildingRequirement":"노인 주거 시설 요건을 충족하지 않습니다.","householdDoesNotNeedAccessibleUnit":"해당 가구는 장애인 편의시설이 필요한 주택이 아닙니다.","other":"다른"}'::jsonb, true)
  WHERE language = 'ko' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'ko',
  '{"applicationUpdate":{"subject":"%{listingName}에 대한 애플리케이션 업데이트","title":"귀하의 신청서가 %{listingName}에 대해 업데이트되었습니다.","greeting":"안녕하세요","updateNotice":"%{listingName}에 대한 주택 신청서가 업데이트되었습니다.","summaryTitle":"변경 사항 요약:","statusChange":"신청 상태가 %{from}에서 %{to}로 변경되었습니다.","accessibleWaitListChange":"귀하의 장애인 대기자 명단 순번은 %{value}입니다.","conventionalWaitListChange":"귀하의 일반 대기자 명단 순번은 %{value}입니다.","statusLabel":"신청 상태","contactNotice":"현재로서는 추가 조치가 필요하지 않습니다. 이번 업데이트와 관련하여 궁금한 사항이 있으시면 문의해 주세요.","viewPrompt":"신청서를 보시려면 아래 링크를 클릭하세요.","viewLink":"내 지원서를 봐주세요","applicationStatus":{"submitted":"제출된","declined":"거절됨","receivedUnit":"유닛을 받았습니다","waitlist":"대기자 명단","waitlistDeclined":"대기자 명단 - 거절됨"},"applicantContactNotice":"이번 업데이트와 관련하여 궁금한 사항이 있으시면 언제든지 문의해 주세요.","advocateUpdateNotice":"귀하께서 %{applicantName} 님을 대신하여 %{listingName}에 제출하신 주택 신청서가 업데이트되었습니다.","advocateViewPrompt":"고객님의 신청서를 보시려면 아래 링크를 클릭하십시오.","advocateViewLink":"지원서 보기","declineReasonChange":"귀하의 지원서가 거절된 이유는 %{value}입니다.","declineReason":{"householdIncomeTooHigh":"가계 소득이 너무 높음","householdIncomeTooLow":"가계 소득이 너무 낮음","householdSizeTooLarge":"가구 규모가 너무 큽니다","householdSizeTooSmall":"가구 규모가 너무 작습니다","attemptedToContactNoResponse":"연락을 시도했으나 응답이 없었습니다.","applicantDeclinedUnit":"지원자가 해당 부서를 거부했습니다.","doesNotMeetSeniorBuildingRequirement":"노인 주거 시설 요건을 충족하지 않습니다.","householdDoesNotNeedAccessibleUnit":"해당 가구는 장애인 편의시설이 필요한 주택이 아닙니다.","other":"다른"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- hy
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"Ձեր դիմումի մերժման պատճառը %{value} է"'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"Ընտանեկան եկամուտը չափազանց բարձր է","householdIncomeTooLow":"Ընտանեկան եկամուտը չափազանց ցածր է","householdSizeTooLarge":"Տնային տնտեսության չափը չափազանց մեծ է","householdSizeTooSmall":"Տնային տնտեսության չափը չափազանց փոքր է","attemptedToContactNoResponse":"Փորձեցի կապ հաստատել, պատասխան չկա","applicantDeclinedUnit":"Դիմորդը մերժեց միավորը","doesNotMeetSeniorBuildingRequirement":"Չի համապատասխանում ավագ շենքի պահանջներին","householdDoesNotNeedAccessibleUnit":"Տնային տնտեսությունը կարիք չունի հասանելի միավորի հատկանիշների","other":"Այլ"}'::jsonb, true)
  WHERE language = 'hy' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'hy',
  '{"applicationUpdate":{"subject":"%{listingName} ծրագրի թարմացում","title":"Ձեր ծրագիրը թարմացվել է %{listingName}-ի համար","greeting":"Բարև","updateNotice":"Ձեր %{listingName}-ի բնակարանային դիմումը թարմացվել է։","summaryTitle":"Փոփոխությունների ամփոփում.","statusChange":"Ձեր դիմումի կարգավիճակը փոխվել է %{from}-ից մինչև %{to}","accessibleWaitListChange":"Ձեր հասանելի սպասման ցուցակի համարը %{value} է","conventionalWaitListChange":"Ձեր սովորական սպասման ցուցակի համարը %{value} է","statusLabel":"Դիմումի կարգավիճակը","contactNotice":"Այս պահին որևէ հետագա գործողություն անհրաժեշտ չէ: Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով՝","viewPrompt":"Ձեր դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը՝","viewLink":"Դիտել իմ դիմումը","applicationStatus":{"submitted":"Ուղարկված է","declined":"Մերժված է","receivedUnit":"Ստացել է միավոր","waitlist":"Սպասման ցուցակ","waitlistDeclined":"Սպասման ցուցակ - Մերժված է"},"applicantContactNotice":"Եթե ունեք հարցեր այս թարմացման վերաբերյալ, խնդրում ենք կապվել հետևյալ հասցեով.","advocateUpdateNotice":"%{applicantName}-ի անունից %{listingName}-ի համար ձեր ներկայացրած բնակարանային դիմումը թարմացվել է։","advocateViewPrompt":"Ձեր հաճախորդի դիմումը դիտելու համար, խնդրում ենք սեղմել ստորև նշված հղումը.","advocateViewLink":"Դիտել դիմումը","declineReasonChange":"Ձեր դիմումի մերժման պատճառը %{value} է","declineReason":{"householdIncomeTooHigh":"Ընտանեկան եկամուտը չափազանց բարձր է","householdIncomeTooLow":"Ընտանեկան եկամուտը չափազանց ցածր է","householdSizeTooLarge":"Տնային տնտեսության չափը չափազանց մեծ է","householdSizeTooSmall":"Տնային տնտեսության չափը չափազանց փոքր է","attemptedToContactNoResponse":"Փորձեցի կապ հաստատել, պատասխան չկա","applicantDeclinedUnit":"Դիմորդը մերժեց միավորը","doesNotMeetSeniorBuildingRequirement":"Չի համապատասխանում ավագ շենքի պահանջներին","householdDoesNotNeedAccessibleUnit":"Տնային տնտեսությունը կարիք չունի հասանելի միավորի հատկանիշների","other":"Այլ"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
-- fa
WITH updated AS (
  UPDATE translations
  SET translations = jsonb_set(jsonb_set(COALESCE(translations, '{}'::jsonb), '{applicationUpdate,declineReasonChange}', '"دلیل رد درخواست شما %{value} است."'::jsonb, true), '{applicationUpdate,declineReason}', '{"householdIncomeTooHigh":"درآمد خانوار خیلی بالاست","householdIncomeTooLow":"درآمد خانوار خیلی پایین است","householdSizeTooLarge":"اندازه خانه خیلی بزرگ است","householdSizeTooSmall":"اندازه خانه خیلی کوچک است","attemptedToContactNoResponse":"تلاش برای تماس؛ بدون پاسخ","applicantDeclinedUnit":"متقاضی واحد را رد کرد","doesNotMeetSeniorBuildingRequirement":"الزامات ساختمان‌های قدیمی را برآورده نمی‌کند","householdDoesNotNeedAccessibleUnit":"خانوار به ویژگی‌های واحد قابل دسترس نیاز ندارد","other":"دیگر"}'::jsonb, true)
  WHERE language = 'fa' AND jurisdiction_id IS NULL
  RETURNING 1
)
INSERT INTO translations ("language", "translations", "jurisdiction_id", "created_at", "updated_at")
SELECT
  'fa',
  '{"applicationUpdate":{"subject":"به‌روزرسانی برنامه برای %{listingName}","title":"برنامه شما برای %{listingName} به‌روزرسانی شده است.","greeting":"سلام","updateNotice":"به‌روزرسانی در درخواست مسکن شما برای %{listingName} انجام شد.","summaryTitle":"خلاصه تغییرات:","statusChange":"وضعیت درخواست شما از %{from} به %{to} تغییر کرده است.","accessibleWaitListChange":"شماره لیست انتظار قابل دسترس شما %{value} است.","conventionalWaitListChange":"شماره لیست انتظار متعارف شما %{value} است.","statusLabel":"وضعیت درخواست","contactNotice":"در حال حاضر هیچ اقدام دیگری لازم نیست. اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید.","viewPrompt":"برای مشاهده درخواست خود، لطفاً روی لینک زیر کلیک کنید:","viewLink":"مشاهده درخواست من","applicationStatus":{"submitted":"ارسال شده","declined":"رد شد","receivedUnit":"واحد دریافت شد","waitlist":"لیست انتظار","waitlistDeclined":"لیست انتظار - رد شد"},"applicantContactNotice":"اگر در مورد این به‌روزرسانی سؤالی دارید، لطفاً با ما تماس بگیرید","advocateUpdateNotice":"درخواست مسکنی که از طرف %{applicantName} برای %{listingName} ارسال کرده بودید، به‌روزرسانی شد.","advocateViewPrompt":"برای مشاهده درخواست مشتری خود، لطفاً روی لینک زیر کلیک کنید:","advocateViewLink":"مشاهده برنامه","declineReasonChange":"دلیل رد درخواست شما %{value} است.","declineReason":{"householdIncomeTooHigh":"درآمد خانوار خیلی بالاست","householdIncomeTooLow":"درآمد خانوار خیلی پایین است","householdSizeTooLarge":"اندازه خانه خیلی بزرگ است","householdSizeTooSmall":"اندازه خانه خیلی کوچک است","attemptedToContactNoResponse":"تلاش برای تماس؛ بدون پاسخ","applicantDeclinedUnit":"متقاضی واحد را رد کرد","doesNotMeetSeniorBuildingRequirement":"الزامات ساختمان‌های قدیمی را برآورده نمی‌کند","householdDoesNotNeedAccessibleUnit":"خانوار به ویژگی‌های واحد قابل دسترس نیاز ندارد","other":"دیگر"}}}'::jsonb,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM updated);
