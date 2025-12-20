import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Plus, Trash2, Image, FileText, Clock, Mail, Home } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all data
  const { data: portfolioItems } = useQuery({
    queryKey: ["admin-portfolio"],
    queryFn: async () => {
      const { data } = await supabase.from("portfolio_items").select("*").order("display_order");
      return data || [];
    },
  });

  const { data: galleryImages } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data } = await supabase.from("gallery_images").select("*").order("display_order");
      return data || [];
    },
  });

  const { data: experienceEntries } = useQuery({
    queryKey: ["admin-experience"],
    queryFn: async () => {
      const { data } = await supabase.from("experience_entries").select("*").order("display_order");
      return data || [];
    },
  });

  const { data: contactMessages } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      return data || [];
    },
  });

  // Form states
  const [newPortfolio, setNewPortfolio] = useState({ title: "", description: "", image_url: "", category: "" });
  const [newGallery, setNewGallery] = useState({ image_url: "", alt_text: "", category: "" });
  const [newExperience, setNewExperience] = useState({ year: "", title: "", description: "" });

  // Mutations
  const addPortfolio = useMutation({
    mutationFn: async (data: typeof newPortfolio) => {
      const { error } = await supabase.from("portfolio_items").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
      setNewPortfolio({ title: "", description: "", image_url: "", category: "" });
      toast({ title: "Portfolio item added!" });
    },
  });

  const deletePortfolio = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio-items"] });
      toast({ title: "Portfolio item deleted!" });
    },
  });

  const addGallery = useMutation({
    mutationFn: async (data: typeof newGallery) => {
      const { error } = await supabase.from("gallery_images").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      setNewGallery({ image_url: "", alt_text: "", category: "" });
      toast({ title: "Gallery image added!" });
    },
  });

  const deleteGallery = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] });
      toast({ title: "Gallery image deleted!" });
    },
  });

  const addExperience = useMutation({
    mutationFn: async (data: typeof newExperience) => {
      const { error } = await supabase.from("experience_entries").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["experience-entries"] });
      setNewExperience({ year: "", title: "", description: "" });
      toast({ title: "Experience entry added!" });
    },
  });

  const deleteExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("experience_entries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
      queryClient.invalidateQueries({ queryKey: ["experience-entries"] });
      toast({ title: "Experience entry deleted!" });
    },
  });

  const deleteMessage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      toast({ title: "Message deleted!" });
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="h-4 w-4 mr-2" /> Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <Home className="h-4 w-4 mr-2" /> View Site
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{portfolioItems?.length || 0}</p><p className="text-sm text-muted-foreground">Portfolio</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Image className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{galleryImages?.length || 0}</p><p className="text-sm text-muted-foreground">Gallery</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{experienceEntries?.length || 0}</p><p className="text-sm text-muted-foreground">Experience</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-2"><Mail className="h-5 w-5 text-primary" /><div><p className="text-2xl font-bold">{contactMessages?.length || 0}</p><p className="text-sm text-muted-foreground">Messages</p></div></div></CardContent></Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-lg">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Add Portfolio Item</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Title" value={newPortfolio.title} onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})} />
                <Input placeholder="Image URL" value={newPortfolio.image_url} onChange={(e) => setNewPortfolio({...newPortfolio, image_url: e.target.value})} />
                <Input placeholder="Category" value={newPortfolio.category} onChange={(e) => setNewPortfolio({...newPortfolio, category: e.target.value})} />
                <Textarea placeholder="Description" value={newPortfolio.description} onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})} />
                <Button onClick={() => addPortfolio.mutate(newPortfolio)} disabled={!newPortfolio.title || !newPortfolio.image_url}><Plus className="h-4 w-4 mr-2" /> Add Item</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {portfolioItems?.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 object-cover rounded" />
                    <div className="flex-1"><h3 className="font-semibold">{item.title}</h3><p className="text-sm text-muted-foreground">{item.category}</p></div>
                    <Button variant="destructive" size="icon" onClick={() => deletePortfolio.mutate(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Add Gallery Image</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Image URL" value={newGallery.image_url} onChange={(e) => setNewGallery({...newGallery, image_url: e.target.value})} />
                <Input placeholder="Alt Text" value={newGallery.alt_text} onChange={(e) => setNewGallery({...newGallery, alt_text: e.target.value})} />
                <Button onClick={() => addGallery.mutate(newGallery)} disabled={!newGallery.image_url}><Plus className="h-4 w-4 mr-2" /> Add Image</Button>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages?.map((img) => (
                <Card key={img.id} className="relative group">
                  <img src={img.image_url} alt={img.alt_text || ""} className="w-full aspect-square object-cover rounded" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteGallery.mutate(img.id)}><Trash2 className="h-4 w-4" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Add Experience Entry</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Year (e.g., 2024)" value={newExperience.year} onChange={(e) => setNewExperience({...newExperience, year: e.target.value})} />
                <Input placeholder="Title" value={newExperience.title} onChange={(e) => setNewExperience({...newExperience, title: e.target.value})} />
                <Textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({...newExperience, description: e.target.value})} />
                <Button onClick={() => addExperience.mutate(newExperience)} disabled={!newExperience.year || !newExperience.title}><Plus className="h-4 w-4 mr-2" /> Add Entry</Button>
              </CardContent>
            </Card>
            <div className="grid gap-4">
              {experienceEntries?.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="pt-6 flex items-center gap-4">
                    <span className="text-primary font-bold">{entry.year}</span>
                    <div className="flex-1"><h3 className="font-semibold">{entry.title}</h3><p className="text-sm text-muted-foreground">{entry.description}</p></div>
                    <Button variant="destructive" size="icon" onClick={() => deleteExperience.mutate(entry.id)}><Trash2 className="h-4 w-4" /></Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {contactMessages?.map((msg) => (
              <Card key={msg.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div><h3 className="font-semibold">{msg.name}</h3><p className="text-sm text-primary">{msg.email}</p><p className="text-muted-foreground mt-2">{msg.message}</p><p className="text-xs text-muted-foreground mt-2">{new Date(msg.created_at).toLocaleDateString()}</p></div>
                    <Button variant="destructive" size="icon" onClick={() => deleteMessage.mutate(msg.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
