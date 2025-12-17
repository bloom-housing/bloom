-- Adds new waitlist lottery confirmation translations for emails.

UPDATE translations
SET translations = jsonb_set(translations, '{confirmation,eligible,waitlistLottery}', '"Eligible applicants will be placed on the waitlist based on lottery rank order."')
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{confirmation,eligible,waitlistLottery}', '"Los solicitantes elegibles serán colocados en la lista de espera según el orden de clasificación de la lotería."')
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(translations, '{confirmation,eligible,waitlistLottery}', '"Ang mga karapat-dapat na aplikante ay ilalagay sa waitlist batay sa order ng ranggo ng lottery."')
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(translations, '{confirmation,eligible,waitlistLottery}', '"Những người nộp đơn đủ điều kiện sẽ được đưa vào danh sách chờ dựa trên thứ hạng xổ số."')
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(translations, '{confirmation,eligible,waitlistLottery}', '"符合資格的申請人將根據抽籤順序列入候補名單。"')
WHERE language = 'zh';
