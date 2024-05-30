-- Adds new script runner translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{scriptRunner}', '{"information": "You previously applied to Fremont Family Apartments, but an error resulted in sending your confirmation email without your confirmation number. Your application number and confirmation number are re-sent below. Thank you for your patience.", "pleaseSave": "Please save this email for your records.", "subject": "Your Application Confirmation Number for Fremont Family Apartments", "yourApplicationNumber": "Your application number is: %{id}", "yourConfirmationNumber": "Your confirmation number is: %{confirmationCode}"}')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{scriptRunner}', '{"information": "Anteriormente presentó su solicitud para Fremont Family Apartments, pero se produjo un error al enviar su correo electrónico de confirmación sin su número de confirmación. Su número de solicitud y número de confirmación se reenvían a continuación. Gracias por su paciencia.", "pleaseSave": "Por favor, guarde este correo electrónico para sus registros.", "subject": "Su Número de Confirmación de Solicitud Para Fremont Family Apartments", "yourApplicationNumber": "Su número de solicitud es: %{id}", "yourConfirmationNumber": "Su numero de confirmación es: %{confirmationCode}"}')
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(translations, '{scriptRunner}', '{"information": "Dati kang nag-apply sa Fremont Family Apartments, ngunit nagkaroon ng error sa pagpapadala ng iyong confirmation email nang wala ang iyong confirmation number. Ang iyong numero ng aplikasyon at numero ng kumpirmasyon ay muling ipinadala sa ibaba. Salamat sa iyong pasensya.", "pleaseSave": "Paki-save ang email na ito para sa iyong mga tala.", "subject": "Iyong Numero ng Kumpirmasyon ng Aplikasyon para sa Fremont Family Apartments", "yourApplicationNumber": "Ang iyong numero ng aplikasyon ay: %{id}", "yourConfirmationNumber": "Ang iyong numero ng kumpirmasyon ay: %{confirmationCode}"}')
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(translations, '{scriptRunner}', '{"information": "Trước đây bạn đã đăng ký vào Fremont Family Apartments nhưng đã xảy ra lỗi khiến bạn gửi email xác nhận mà không có số xác nhận. Số đơn đăng ký và số xác nhận của bạn được gửi lại bên dưới. Cảm ơn vì sự kiên nhẫn của bạn.", "pleaseSave": "Vui lòng lưu email này vào hồ sơ của bạn.", "subject": "Số xác nhận đơn đăng ký của bạn cho Fremont Family Apartments", "yourApplicationNumber": "Số đơn đăng ký của bạn là: %{id}", "yourConfirmationNumber": "Số xác nhận của bạn là: %{confirmationCode}"}')
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(translations, '{scriptRunner}', '{"information": "您之前申請過 Fremont Family Apartments, 但由於錯誤而導致您發送的確認電子郵件中沒有您的確認號碼。您的申請號碼和確認號碼將在下面重新發送。感謝您的耐心等待。", "pleaseSave": "請儲存此電子郵件作為您的記錄。", "subject": "您的 Fremont Family Apartments 申請確認號", "yourApplicationNumber": "您的申請號碼是： %{id}", "yourConfirmationNumber": "您的確認號碼是： %{confirmationCode}"}')
WHERE language = 'zh';
