-- Adds new waitlist lottery confirmation translations for emails.
UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{accountRemoval}',
        '{
        "subject": "Bloom Housing Scheduled Account Removal Due to Inactivity",
        "courtesyText1": "This is a courtesy email to let you know that because your Bloom Housing Portal account has been inactive for 3 years, your account will be deleted in 30 days per our",
        "courtesyText2": "If you’d like to keep your account, please log in anytime in the next month and we’ll consider your account active again.",
        "signIn": "Sign in to Bloom Housing",
        "privacyPolicy": "Privacy Policy",
        "privacyPolicyUrl": "localhost:3000/privacy-policy"
        }'
    )
WHERE
    language = 'en';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{accountRemoval}',
        '{
        "subject": "Eliminación programada de cuenta de Bloom Housing debido a inactividad",
        "courtesyText1": "Este es un mensaje de cortesía para informarle que, debido a que su cuenta del portal Bloom Housing ha estado inactiva durante 3 años, se eliminará en un plazo de 30 días conforme a nuestra",
        "courtesyText2": "Si desea conservar su cuenta, por favor inicie sesión en cualquier momento durante el próximo mes y la consideraremos nuevamente activa.",        "signIn": "Iniciar sesión en Bloom Housing",
        "privacyPolicy": "Política de privacidad",
        "privacyPolicyUrl": "localhost:3000/privacy-policy",
        "signIn": "Iniciar sesión en Bloom Housing"
        }'
    )
WHERE
    language = 'es';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{accountRemoval}',
        '{
        "subject": "Bloom Housing Scheduled Account Removal Dahil sa Kawalan ng Aktibidad",
        "courtesyText1": "Ito ay isang courtesy email upang ipaalam sa iyo na dahil ang iyong Bloom Housing Portal account ay hindi aktibo sa loob ng 3 taon, ang iyong account ay buburahin sa loob ng 30 araw ayon sa aming",
        "courtesyText2": "Kung nais mong panatilihin ang iyong account, mangyaring mag-log in anumang oras sa susunod na buwan at ituturing naming aktibo muli ang iyong account.",
        "signIn": "Mag-sign in sa Bloom Housing",
        "privacyPolicy": "Patakaran sa Pagkapribado",
        "privacyPolicyUrl": "localhost:3000/privacy-policy"
        }'
    )
WHERE
    language = 'tl';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{accountRemoval}',
        '{
        "subject": "Bloom Housing đã lên lịch xóa tài khoản do không hoạt động",
        "courtesyText1": "Đây là một email thông báo rằng vì tài khoản Bloom Housing Portal của bạn đã không hoạt động trong 3 năm, tài khoản của bạn sẽ bị xóa trong vòng 30 ngày theo chính sách của chúng tôi.",
        "courtesyText2": "Nếu bạn muốn giữ tài khoản của mình, vui lòng đăng nhập bất cứ lúc nào trong tháng tới và chúng tôi sẽ coi tài khoản của bạn là hoạt động trở lại.",
        "signIn": "Đăng nhập vào Bloom Housing",
        "privacyPolicy": "Chính sách bảo mật",
        "privacyPolicyUrl": "localhost:3000/privacy-policy"
        }'
    )
WHERE
    language = 'vi';

UPDATE
    translations
SET
    translations = jsonb_set(
        translations,
        '{accountRemoval}',
        '{
        "subject": "Bloom Housing 因帳戶長期不活躍，計劃刪除您的帳戶",
        "courtesyText1": "這是一封禮貌性郵件，通知您由於您的 Bloom Housing Portal 帳戶已閒置 3 年，根據我們的政策，您的帳戶將在 30 天後被刪除。",
        "courtesyText2": "如果您想保留您的帳戶，請在下個月內隨時登錄，我們將視您的帳戶為已重新啟用。",
        "signIn": "登入 Bloom Housing",
        "privacyPolicy": "隱私權政策",
        "privacyPolicyUrl": "localhost:3000/privacy-policy"
        }'
    )
WHERE
    language = 'zh';