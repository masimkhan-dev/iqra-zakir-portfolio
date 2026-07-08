import { supabase } from "@/integrations/supabase/client";
import { queryOptions } from "@tanstack/react-query";

export type HeroContent = {
  greeting: string;
  name: string;
  roles: string[];
  tagline: string;
  resume_url?: string;
};
export type AboutContent = {
  story: string;
  mission: string;
  vision: string;
  stats: { label: string; value: number }[];
};
export type ContactContent = {
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  socials: Record<string, string>;
};

export async function fetchSiteContent() {
  const { data, error } = await supabase.from("site_content").select("key,value");
  if (error) throw error;
  const map: Record<string, any> = {};
  for (const row of data ?? []) map[row.key] = row.value;
  return {
    hero: (map.hero ?? {}) as HeroContent,
    about: (map.about ?? {}) as AboutContent,
    contact: (map.contact ?? {}) as ContactContent,
    seo: (map.seo ?? {}) as { title?: string; description?: string; keywords?: string },
  };
}

export const siteContentQuery = queryOptions({
  queryKey: ["site_content"],
  queryFn: fetchSiteContent,
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: async () => {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
export const skillsQuery = queryOptions({
  queryKey: ["skills"],
  queryFn: async () => {
    const { data, error } = await supabase.from("skills").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: async () => {
    const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
export const experiencesQuery = queryOptions({
  queryKey: ["experiences"],
  queryFn: async () => {
    const { data, error } = await supabase.from("experiences").select("*").order("sort_order");
    if (error) throw error;
    return data ?? [];
  },
});
export const messagesQuery = queryOptions({
  queryKey: ["messages"],
  queryFn: async () => {
    const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
});