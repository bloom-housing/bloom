-- Adds bulk application upload email translations.

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "View Applications",
    "success": {
      "subject": "Your bulk application update for %{listingName} is complete",
      "message": "Your bulk update has been processed successfully.",
      "count": "%{updateCount} application records were updated."
    },
    "successWithError": {
      "subject": "Your bulk application update for %{listingName} is complete",
      "message": "Your bulk update has been processed successfully. However, %{failedEmailsCount} applicant notification email(s) could not be sent.",
      "errors": "%{updateCount} application records were updated. Please contact your technical team for next steps on notifications resolution."
    },
    "failure": {
      "subject": "Your bulk application update for %{listingName} could not be completed",
      "message": "Your bulk update encountered an error and could not be completed.",
      "help": "Records before the failed row have been updated. If a re-upload of your file does not fix the issue, please reach out to the support team."
    }
  }'::jsonb
)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "Ver solicitudes",
    "success": {
      "subject": "Su actualización masiva de solicitudes para %{listingName} se ha completado",
      "message": "Su actualización masiva se ha procesado correctamente.",
      "count": "Se actualizaron %{updateCount} registros de solicitudes."
    },
    "successWithError": {
      "subject": "Su actualización masiva de solicitudes para %{listingName} se ha completado",
      "message": "Su actualización masiva se ha procesado correctamente. Sin embargo, no se pudieron enviar %{failedEmailsCount} correo(s) de notificación a los solicitantes.",
      "errors": "Se actualizaron %{updateCount} registros de solicitudes. Comuníquese con su equipo técnico para conocer los próximos pasos para resolver las notificaciones."
    },
    "failure": {
      "subject": "No se pudo completar su actualización masiva de solicitudes para %{listingName}",
      "message": "Su actualización masiva encontró un error y no se pudo completar.",
      "help": "Los registros anteriores a la fila con error se han actualizado. Si volver a cargar el archivo no soluciona el problema, comuníquese con el equipo de soporte."
    }
  }'::jsonb
)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "Xem đơn đăng ký",
    "success": {
      "subject": "Cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName} đã hoàn tất",
      "message": "Cập nhật hàng loạt của bạn đã được xử lý thành công.",
      "count": "Đã cập nhật %{updateCount} hồ sơ đơn đăng ký."
    },
    "successWithError": {
      "subject": "Cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName} đã hoàn tất",
      "message": "Cập nhật hàng loạt của bạn đã được xử lý thành công. Tuy nhiên, không thể gửi %{failedEmailsCount} email thông báo cho người nộp đơn.",
      "errors": "Đã cập nhật %{updateCount} hồ sơ đơn đăng ký. Vui lòng liên hệ với nhóm kỹ thuật của bạn để biết các bước tiếp theo về việc xử lý thông báo."
    },
    "failure": {
      "subject": "Không thể hoàn tất cập nhật hàng loạt đơn đăng ký của bạn cho %{listingName}",
      "message": "Cập nhật hàng loạt của bạn gặp lỗi và không thể hoàn tất.",
      "help": "Các hồ sơ trước dòng bị lỗi đã được cập nhật. Nếu tải lại tệp của bạn không khắc phục được sự cố, vui lòng liên hệ với nhóm hỗ trợ."
    }
  }'::jsonb
)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "查看申请",
    "success": {
      "subject": "您针对 %{listingName} 的批量申请更新已完成",
      "message": "您的批量更新已成功处理。",
      "count": "已更新 %{updateCount} 条申请记录。"
    },
    "successWithError": {
      "subject": "您针对 %{listingName} 的批量申请更新已完成",
      "message": "您的批量更新已成功处理。但是，有 %{failedEmailsCount} 封申请人通知电子邮件无法发送。",
      "errors": "已更新 %{updateCount} 条申请记录。请联系您的技术团队，了解解决通知问题的后续步骤。"
    },
    "failure": {
      "subject": "您针对 %{listingName} 的批量申请更新无法完成",
      "message": "您的批量更新遇到错误，无法完成。",
      "help": "失败行之前的记录已更新。如果重新上传文件仍无法解决问题，请联系支持团队。"
    }
  }'::jsonb
)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "Tingnan ang mga Aplikasyon",
    "success": {
      "subject": "Kumpleto na ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}",
      "message": "Matagumpay na naproseso ang iyong bulk na pag-update.",
      "count": "%{updateCount} na talaan ng aplikasyon ang na-update."
    },
    "successWithError": {
      "subject": "Kumpleto na ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}",
      "message": "Matagumpay na naproseso ang iyong bulk na pag-update. Gayunpaman, %{failedEmailsCount} na email ng abiso sa aplikante ang hindi naipadala.",
      "errors": "%{updateCount} na talaan ng aplikasyon ang na-update. Mangyaring makipag-ugnayan sa iyong teknikal na koponan para sa mga susunod na hakbang sa paglutas ng mga abiso."
    },
    "failure": {
      "subject": "Hindi makumpleto ang iyong bulk na pag-update ng aplikasyon para sa %{listingName}",
      "message": "Nakaranas ng error ang iyong bulk na pag-update at hindi ito makumpleto.",
      "help": "Ang mga talaan bago ang row na nabigo ay na-update na. Kung hindi maaayos ng muling pag-upload ng iyong file ang isyu, mangyaring makipag-ugnayan sa support team."
    }
  }'::jsonb
)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "আবেদনগুলো দেখুন",
    "success": {
      "subject": "%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন হয়েছে",
      "message": "আপনার বাল্ক আপডেট সফলভাবে প্রক্রিয়া করা হয়েছে।",
      "count": "%{updateCount}টি আবেদন রেকর্ড আপডেট করা হয়েছে।"
    },
    "successWithError": {
      "subject": "%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন হয়েছে",
      "message": "আপনার বাল্ক আপডেট সফলভাবে প্রক্রিয়া করা হয়েছে। তবে, %{failedEmailsCount}টি আবেদনকারীর বিজ্ঞপ্তি ইমেল পাঠানো যায়নি।",
      "errors": "%{updateCount}টি আবেদন রেকর্ড আপডেট করা হয়েছে। বিজ্ঞপ্তি সমাধানের পরবর্তী পদক্ষেপের জন্য অনুগ্রহ করে আপনার প্রযুক্তিগত দলের সাথে যোগাযোগ করুন।"
    },
    "failure": {
      "subject": "%{listingName}-এর জন্য আপনার বাল্ক আবেদন আপডেট সম্পন্ন করা যায়নি",
      "message": "আপনার বাল্ক আপডেটে একটি ত্রুটি দেখা দিয়েছে এবং এটি সম্পন্ন করা যায়নি।",
      "help": "ব্যর্থ সারির আগের রেকর্ডগুলো আপডেট করা হয়েছে। আপনার ফাইল পুনরায় আপলোড করলে সমস্যাটি সমাধান না হলে, অনুগ্রহ করে সহায়তা দলের সাথে যোগাযোগ করুন।"
    }
  }'::jsonb
)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "عرض الطلبات",
    "success": {
      "subject": "اكتمل التحديث المجمّع لطلبك الخاص بـ %{listingName}",
      "message": "تمت معالجة التحديث المجمّع الخاص بك بنجاح.",
      "count": "تم تحديث %{updateCount} من سجلات الطلبات."
    },
    "successWithError": {
      "subject": "اكتمل التحديث المجمّع لطلبك الخاص بـ %{listingName}",
      "message": "تمت معالجة التحديث المجمّع الخاص بك بنجاح. ومع ذلك، تعذّر إرسال %{failedEmailsCount} من رسائل إشعار مقدّمي الطلبات.",
      "errors": "تم تحديث %{updateCount} من سجلات الطلبات. يُرجى التواصل مع فريقك التقني لمعرفة الخطوات التالية لحل مشكلة الإشعارات."
    },
    "failure": {
      "subject": "تعذّر إكمال التحديث المجمّع لطلبك الخاص بـ %{listingName}",
      "message": "واجه التحديث المجمّع الخاص بك خطأً وتعذّر إكماله.",
      "help": "تم تحديث السجلات السابقة للصف الذي فشل. إذا لم تؤدِّ إعادة رفع الملف إلى حل المشكلة، فيُرجى التواصل مع فريق الدعم."
    }
  }'::jsonb
)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "신청서 보기",
    "success": {
      "subject": "%{listingName}에 대한 일괄 신청서 업데이트가 완료되었습니다",
      "message": "일괄 업데이트가 성공적으로 처리되었습니다.",
      "count": "%{updateCount}개의 신청서 기록이 업데이트되었습니다."
    },
    "successWithError": {
      "subject": "%{listingName}에 대한 일괄 신청서 업데이트가 완료되었습니다",
      "message": "일괄 업데이트가 성공적으로 처리되었습니다. 그러나 %{failedEmailsCount}개의 신청자 알림 이메일을 보낼 수 없었습니다.",
      "errors": "%{updateCount}개의 신청서 기록이 업데이트되었습니다. 알림 문제 해결을 위한 다음 단계에 대해서는 기술팀에 문의하세요."
    },
    "failure": {
      "subject": "%{listingName}에 대한 일괄 신청서 업데이트를 완료할 수 없습니다",
      "message": "일괄 업데이트 중 오류가 발생하여 완료할 수 없었습니다.",
      "help": "실패한 행 이전의 기록은 업데이트되었습니다. 파일을 다시 업로드해도 문제가 해결되지 않으면 지원팀에 문의하세요."
    }
  }'::jsonb
)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "Դիտել դիմումները",
    "success": {
      "subject": "%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումն ավարտված է",
      "message": "Ձեր զանգվածային թարմացումը հաջողությամբ մշակվել է։",
      "count": "Թարմացվել է դիմումների %{updateCount} գրառում։"
    },
    "successWithError": {
      "subject": "%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումն ավարտված է",
      "message": "Ձեր զանգվածային թարմացումը հաջողությամբ մշակվել է։ Այնուամենայնիվ, %{failedEmailsCount} դիմորդի ծանուցման նամակ չհաջողվեց ուղարկել։",
      "errors": "Թարմացվել է դիմումների %{updateCount} գրառում։ Ծանուցումների լուծման հաջորդ քայլերի համար խնդրում ենք կապվել Ձեր տեխնիկական թիմի հետ։"
    },
    "failure": {
      "subject": "%{listingName}-ի համար Ձեր դիմումների զանգվածային թարմացումը չհաջողվեց ավարտել",
      "message": "Ձեր զանգվածային թարմացումը հանդիպեց սխալի և չհաջողվեց ավարտել։",
      "help": "Ձախողված տողից առաջ գրառումները թարմացվել են։ Եթե Ձեր ֆայլի կրկնակի վերբեռնումը չլուծի խնդիրը, խնդրում ենք կապվել աջակցման թիմի հետ։"
    }
  }'::jsonb
)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(
  translations,
  '{applicationBulk}',
  COALESCE(translations->'applicationBulk', '{}'::jsonb) || '{
    "viewApplications": "مشاهده درخواست‌ها",
    "success": {
      "subject": "به‌روزرسانی گروهی درخواست شما برای %{listingName} کامل شد",
      "message": "به‌روزرسانی گروهی شما با موفقیت پردازش شد.",
      "count": "%{updateCount} سابقه درخواست به‌روزرسانی شد."
    },
    "successWithError": {
      "subject": "به‌روزرسانی گروهی درخواست شما برای %{listingName} کامل شد",
      "message": "به‌روزرسانی گروهی شما با موفقیت پردازش شد. با این حال، %{failedEmailsCount} ایمیل اطلاع‌رسانی به متقاضیان ارسال نشد.",
      "errors": "%{updateCount} سابقه درخواست به‌روزرسانی شد. لطفاً برای مراحل بعدی جهت رفع مشکل اطلاع‌رسانی‌ها با تیم فنی خود تماس بگیرید."
    },
    "failure": {
      "subject": "به‌روزرسانی گروهی درخواست شما برای %{listingName} قابل تکمیل نبود",
      "message": "به‌روزرسانی گروهی شما با خطا مواجه شد و قابل تکمیل نبود.",
      "help": "سوابق پیش از ردیف ناموفق به‌روزرسانی شده‌اند. اگر بارگذاری مجدد فایل شما مشکل را برطرف نکرد، لطفاً با تیم پشتیبانی تماس بگیرید."
    }
  }'::jsonb
)
WHERE language = 'fa';
