
-- ══════════════════════════════════════════
-- SEED: Contact & Hero Data for Iqra Zakir
-- ══════════════════════════════════════════

INSERT INTO public.site_content (key, value)
VALUES (
  'contact',
  '{
    "email": "iqrazakir455@gmail.com",
    "phone": "",
    "location": "Pakistan",
    "socials": {
      "linkedin":  "https://www.linkedin.com/in/iqra-zakir-000981378",
      "instagram": "https://www.instagram.com/iqra_design_"
    }
  }'::jsonb
)
ON CONFLICT (key) DO UPDATE
  SET value      = EXCLUDED.value,
      updated_at = now();
