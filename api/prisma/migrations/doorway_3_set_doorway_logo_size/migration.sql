insert into translation_strings ("jurisdiction_id", "language", "site", "key", "value", "created_at", "updated_at")
values (null, 'en', 'email', 'header.logoHeight', '65', now() AT TIME ZONE 'UTC', now() AT TIME ZONE 'UTC')
on conflict ("jurisdiction_id", "language", "site", "key") do nothing;