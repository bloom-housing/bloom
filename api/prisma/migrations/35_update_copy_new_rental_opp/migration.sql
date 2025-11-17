UPDATE
  translations
SET
  translations = jsonb_set(
    translations,
    '{rentalOpportunity, viewListingNotice}',
    '"THIS INFORMATION MAY CHANGE - Please view listing for the most updated information"'
  )
WHERE
  language = 'en';


UPDATE
  translations
SET
  translations = jsonb_set(
    translations,
    '{rentalOpportunity, viewListingNotice}',
   '"ESTA INFORMACIÓN PUEDE CAMBIAR: consulte la lista para obtener la información más actualizada"'
  )
WHERE
  language = 'es';

UPDATE
  translations
SET
  translations = jsonb_set(
    translations,
    '{rentalOpportunity, viewListingNotice}',
   '"此資訊可能會更改 - 請查看列表以獲取最新信息"'
  )
WHERE
  language = 'zh';

UPDATE
  translations
SET
  translations = jsonb_set(
    translations,
    '{rentalOpportunity,viewListingNotice}',
    '"THÔNG TIN NÀY CÓ THỂ THAY ĐỔI - Vui lòng xem danh sách để biết thông tin cập nhật nhất"'
  )
WHERE
  language = 'vi';



UPDATE
  translations
SET
  translations = jsonb_set(
    translations,
    '{rentalOpportunity, viewListingNotice}',
    '"MAAARING MAGBAGO ANG IMPORMASYON NA ITO - Mangyaring tingnan ang listahan para sa pinakabagong impormasyon"'
  )
WHERE
  language = 'tl';