import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  siteContentQuery, projectsQuery, servicesQuery, skillsQuery,
  testimonialsQuery, experiencesQuery, messagesQuery,
} from "@/lib/site-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Save, Trash2, Plus, Mail, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({ component: Admin });

function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) { navigate({ to: "/auth" }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.user.id);
      setIsAdmin(!!data?.some(r => r.role === "admin"));
    })();
  }, [navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  if (isAdmin === null) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  if (!isAdmin) return <NoAdmin onSignOut={signOut} />;

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background/70 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-display text-lg">Iqra Zakir <span className="text-muted-foreground italic">Admin</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/"><Button variant="ghost" size="sm">View site <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Button></Link>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-1.5 h-3.5 w-3.5" /> Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Tabs defaultValue="hero">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="hero"><SiteContentEditor keyName="hero" /></TabsContent>
          <TabsContent value="about"><SiteContentEditor keyName="about" /></TabsContent>
          <TabsContent value="contact"><SiteContentEditor keyName="contact" /></TabsContent>
          <TabsContent value="projects"><TableEditor table="projects" fields={["title","slug","category","description","cover_url","tech","live_url","github_url","behance_url","featured","sort_order"]} /></TabsContent>
          <TabsContent value="services"><TableEditor table="services" fields={["title","description","icon","category","sort_order"]} /></TabsContent>
          <TabsContent value="skills"><TableEditor table="skills" fields={["name","category","level","sort_order"]} /></TabsContent>
          <TabsContent value="testimonials"><TableEditor table="testimonials" fields={["name","role","company","avatar_url","rating","quote","sort_order"]} /></TabsContent>
          <TabsContent value="experience"><TableEditor table="experiences" fields={["company","role","period","description","sort_order"]} /></TabsContent>
          <TabsContent value="messages"><MessagesPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function NoAdmin({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center glass rounded-2xl p-8">
        <h1 className="font-display text-2xl">You're signed in — but not an admin.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Ask Iqra to grant your account admin access. Then reload this page.</p>
        <p className="mt-3 text-xs text-muted-foreground">Owner: grant admin from the Cloud dashboard by inserting a row into <code>user_roles</code> with your user id and role <code>admin</code>.</p>
        <Button className="mt-6" onClick={onSignOut}>Sign out</Button>
      </div>
    </div>
  );
}

function SiteContentEditor({ keyName }: { keyName: string }) {
  const qc = useQueryClient();
  const { data } = useQuery(siteContentQuery);
  const [text, setText] = useState("");
  useEffect(() => {
    if (!data) return;
    setText(JSON.stringify((data as any)[keyName] ?? {}, null, 2));
  }, [data, keyName]);
  const save = useMutation({
    mutationFn: async () => {
      let parsed;
      try { parsed = JSON.parse(text); } catch { throw new Error("Invalid JSON"); }
      const { error } = await supabase.from("site_content").upsert({ key: keyName, value: parsed, updated_at: new Date().toISOString() });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Saved."); qc.invalidateQueries({ queryKey: ["site_content"] }); },
    onError: (e: any) => toast.error(e.message),
  });
  return (
    <div className="mt-6 glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-2xl capitalize">{keyName}</h2>
          <p className="text-sm text-muted-foreground">Edit as JSON. Save to publish immediately.</p>
        </div>
        <Button onClick={() => save.mutate()} disabled={save.isPending}><Save className="mr-1.5 h-4 w-4" /> Save</Button>
      </div>
      <Textarea value={text} onChange={e => setText(e.target.value)} rows={22} className="font-mono text-xs" />
    </div>
  );
}

const QUERIES: Record<string, any> = {
  projects: projectsQuery, services: servicesQuery, skills: skillsQuery,
  testimonials: testimonialsQuery, experiences: experiencesQuery,
};

function TableEditor({ table, fields }: { table: string; fields: string[] }) {
  const qc = useQueryClient();
  const query = QUERIES[table];
  const { data } = useQuery(query);
  const items = (data as any[] | undefined) ?? [];
  const [editing, setEditing] = useState<any>(null);

  const remove = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); qc.invalidateQueries({ queryKey: query.queryKey });
  };
  const startNew = () => {
    const blank: any = {};
    for (const f of fields) blank[f] = f === "featured" ? false : f === "level" || f === "rating" || f === "sort_order" ? 0 : f === "tech" ? "" : "";
    setEditing(blank);
  };
  const save = async () => {
    const payload: any = { ...editing };
    if (payload.tech && typeof payload.tech === "string") payload.tech = payload.tech.split(",").map((s: string) => s.trim()).filter(Boolean);
    if (payload.level != null) payload.level = Number(payload.level);
    if (payload.rating != null) payload.rating = Number(payload.rating);
    if (payload.sort_order != null) payload.sort_order = Number(payload.sort_order);
    const { error } = payload.id
      ? await supabase.from(table as any).update(payload).eq("id", payload.id)
      : await supabase.from(table as any).insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: query.queryKey });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl capitalize">{table}</h2>
        <Button onClick={startNew}><Plus className="mr-1.5 h-4 w-4" /> New</Button>
      </div>
      <div className="grid gap-3">
        {items.map((item: any) => (
          <div key={item.id} className="glass rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium truncate">{item.title || item.name || item.role}</div>
              <div className="text-xs text-muted-foreground truncate">{item.category || item.company || item.quote}</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing({ ...item, tech: Array.isArray(item.tech) ? item.tech.join(", ") : item.tech })}>Edit</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur grid place-items-center p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-2xl bg-background rounded-3xl p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h3 className="font-display text-2xl mb-4">{editing.id ? "Edit" : "New"} {table.slice(0, -1)}</h3>
            <div className="grid gap-3">
              {fields.map(f => (
                <label key={f} className="text-sm">
                  <span className="mb-1 inline-block text-muted-foreground capitalize">{f.replace(/_/g, " ")}</span>
                  {f === "featured" ? (
                    <input type="checkbox" checked={!!editing[f]} onChange={e => setEditing({ ...editing, [f]: e.target.checked })} className="h-4 w-4 ml-2" />
                  ) : f === "description" || f === "quote" ? (
                    <Textarea rows={4} value={editing[f] ?? ""} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
                  ) : (
                    <Input value={editing[f] ?? ""} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MessagesPanel() {
  const qc = useQueryClient();
  const { data } = useQuery(messagesQuery);
  const items = (data as any[] | undefined) ?? [];
  const toggle = async (id: string, is_read: boolean) => {
    await supabase.from("messages").update({ is_read: !is_read }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["messages"] });
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("messages").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["messages"] });
  };
  return (
    <div className="mt-6 grid gap-3">
      {items.length === 0 && <div className="glass rounded-2xl p-8 text-center text-muted-foreground">No messages yet.</div>}
      {items.map((m: any) => (
        <div key={m.id} className={`glass rounded-2xl p-5 ${m.is_read ? "opacity-60" : ""}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="font-medium">{m.name}</span>
                <span className="text-xs text-muted-foreground">&lt;{m.email}&gt;</span>
                {!m.is_read && <span className="text-[10px] uppercase tracking-widest bg-gold px-2 py-0.5 rounded-full">New</span>}
              </div>
              {m.subject && <div className="mt-2 text-sm font-medium">{m.subject}</div>}
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{m.body}</p>
              <div className="mt-3 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" onClick={() => toggle(m.id, m.is_read)}>{m.is_read ? "Mark unread" : "Mark read"}</Button>
              <Button size="sm" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}