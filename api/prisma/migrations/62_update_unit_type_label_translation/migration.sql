-- Updates unitType label in rental opportunity notification email from "Unit type" to "Available accessible units"

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"Available accessible units"'::jsonb)
WHERE language = 'en';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"Unidades accesibles disponibles"'::jsonb)
WHERE language = 'es';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"Các căn hộ có sẵn"'::jsonb)
WHERE language = 'vi';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"可用的无障碍单元"'::jsonb)
WHERE language = 'zh';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"Mga available na accessible unit"'::jsonb)
WHERE language = 'tl';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"উপলব্ধ প্রবেশযোগ্য ইউনিট"'::jsonb)
WHERE language = 'bn';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"الوحدات المتاحة لذوي الاحتياجات الخاصة"'::jsonb)
WHERE language = 'ar';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"장애인 접근 가능 객실"'::jsonb)
WHERE language = 'ko';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"Հասանելի հաշմանդամների համար նախատեսված միավորներ"'::jsonb)
WHERE language = 'hy';

UPDATE translations
SET translations = jsonb_set(translations, '{rentalOpportunity,unitType}', '"واحدهای قابل دسترس موجود"'::jsonb)
WHERE language = 'fa';
