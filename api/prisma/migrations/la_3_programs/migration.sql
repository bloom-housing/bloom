INSERT INTO multiselect_questions (
	created_at,
	updated_at,
	application_section,
	description,
	hide_from_listing,
	is_exclusive,
	jurisdiction_id,
	links,
	name,
	options,
	opt_out_text,
	status,
	text,
	was_created_externally
)
SELECT
	now(),
	now(),
	'programs'::"multiselect_questions_application_section_enum",
	'Some units require at least one resident to have a mobility accessibility need',
	false,
	true,
	j.id,
	'[]'::jsonb,
	'Mobility accessibility needs',
	'[{"text":"Wheelchair","ordinal":0},{"text":"Walker","ordinal":1},{"text":"Power chair","ordinal":2},{"text":"Other mobility device","ordinal":3}]'::jsonb,
	'None of the above',
	'active'::"multiselect_questions_status_enum",
	'Mobility accessibility needs',
	false
FROM jurisdictions j
WHERE j.name = 'Los Angeles'
	AND NOT EXISTS (
		SELECT 1
		FROM multiselect_questions mq
		WHERE mq.jurisdiction_id = j.id
			AND mq.text = 'Mobility accessibility needs'
			AND mq.application_section = 'programs'
	);


INSERT INTO multiselect_questions (
	created_at,
	updated_at,
	application_section,
	description,
	hide_from_listing,
	is_exclusive,
	jurisdiction_id,
	links,
	name,
	options,
	opt_out_text,
	status,
	text,
	was_created_externally
)
SELECT
	now(),
	now(),
	'programs'::"multiselect_questions_application_section_enum",
	'Some units require at least one resident to have a hearing / vision accessibility need',
	false,
	true,
	j.id,
	'[]'::jsonb,
	'Hearing/vision accessibility needs',
	'[{"text":"Audible and visual doorbells","ordinal":0},{"text":"Fire and smoke alarms with hard wired strobes","ordinal":1},{"text":"Documents in screen-reader accessible format","ordinal":2},{"text":"Documents in large text or braille","ordinal":3}]'::jsonb,
	'None of the above',
	'active'::"multiselect_questions_status_enum",
	'Hearing/vision accessibility needs',
	false
FROM jurisdictions j
WHERE j.name = 'Los Angeles'
	AND NOT EXISTS (
		SELECT 1
		FROM multiselect_questions mq
		WHERE mq.jurisdiction_id = j.id
			AND mq.text = 'Hearing/vision accessibility needs'
			AND mq.application_section = 'programs'
	);
