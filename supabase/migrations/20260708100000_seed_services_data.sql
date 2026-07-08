
-- ══════════════════════════════════════════
-- SEED: Services Data for Iqra Zakir Studio
-- ══════════════════════════════════════════

INSERT INTO public.services (title, description, icon, category, sort_order) VALUES

-- 1. Graphic Design
(
  'Graphic Design',
  'From social media graphics to print-ready materials — I create eye-catching visuals that communicate your brand message with impact and style.',
  'Palette',
  'Design',
  1
),

-- 2. Logo Design
(
  'Logo Design',
  'Memorable, versatile logos crafted to represent your brand identity perfectly. Every mark is designed to work across all mediums and leave a lasting impression.',
  'Image',
  'Branding',
  2
),

-- 3. Brand Identity
(
  'Brand Identity',
  'Complete brand packages including logo, color palette, typography, and brand guidelines — everything you need to build a consistent and powerful brand presence.',
  'Sparkles',
  'Branding',
  3
),

-- 4. UI/UX Design
(
  'UI/UX Design',
  'User-centered digital experiences that are both beautiful and intuitive. I design interfaces that delight users and drive conversions — from wireframes to polished prototypes.',
  'LayoutDashboard',
  'Design',
  4
),

-- 5. Web Development
(
  'Web Development',
  'Modern, responsive, and blazing-fast websites built with clean code and best practices. I bring your designs to life with smooth interactions and pixel-perfect implementation.',
  'Code2',
  'Development',
  5
),

-- 6. Illustration
(
  'Illustration',
  'Custom digital illustrations that tell your story with creativity and personality. From character design to editorial illustrations — unique artwork tailored to your vision.',
  'Brush',
  'Design',
  6
),

-- 7. Social Media Design
(
  'Social Media Design',
  'Scroll-stopping content designed for Instagram, Facebook, LinkedIn, and more. Cohesive templates, post designs, and story graphics that strengthen your online presence.',
  'LayoutTemplate',
  'Design',
  7
),

-- 8. Poster & Banner Design
(
  'Poster & Banner Design',
  'High-impact posters, banners, and promotional materials for events, campaigns, and marketing — designed to capture attention and communicate your message instantly.',
  'Image',
  'Design',
  8
)

ON CONFLICT DO NOTHING;
