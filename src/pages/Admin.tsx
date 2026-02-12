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
import {
  LogOut,
  Plus,
  Trash2,
  Image,
  FileText,
  Clock,
  Mail,
  Home,
  Camera,
  LayoutDashboard,
  TrendingUp,
  Eye,
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("portfolio");

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
        <Card className="max-w-md w-full border-border/50">
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

  const tabs = [
    { id: "portfolio", label: "Portfolio", icon: FileText, count: portfolioItems?.length || 0 },
    { id: "gallery", label: "Gallery", icon: Image, count: galleryImages?.length || 0 },
    { id: "experience", label: "Experience", icon: Clock, count: experienceEntries?.length || 0 },
    { id: "messages", label: "Messages", icon: Mail, count: contactMessages?.length || 0 },
  ];

  const totalItems = (portfolioItems?.length || 0) + (galleryImages?.length || 0) + (experienceEntries?.length || 0);
  const unreadMessages = contactMessages?.filter((m) => !m.is_read)?.length || 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm flex flex-col fixed h-full">
        {/* Brand */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground tracking-wide">KNOXS</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "overview"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="flex items-center gap-3">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>

        {/* User & Actions */}
        <div className="p-4 border-t border-border/30 space-y-2">
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={() => navigate("/")}>
            <Eye className="h-4 w-4 mr-2" /> View Site
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/30 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground capitalize">
                {activeTab === "overview" ? "Dashboard Overview" : activeTab}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Manage your portfolio content
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadMessages > 0 && (
                <button
                  onClick={() => setActiveTab("messages")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  {unreadMessages} new
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Portfolio Items", value: portfolioItems?.length || 0, icon: FileText, color: "text-primary" },
                  { label: "Gallery Images", value: galleryImages?.length || 0, icon: Image, color: "text-primary" },
                  { label: "Experience", value: experienceEntries?.length || 0, icon: Clock, color: "text-primary" },
                  { label: "Messages", value: contactMessages?.length || 0, icon: Mail, color: "text-primary" },
                ].map((stat) => (
                  <Card key={stat.label} className="border-border/30 bg-card/50 hover:bg-card/80 transition-colors group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <TrendingUp className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                      <p className="text-3xl font-bold text-foreground font-display">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-border/30 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Recent Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {portfolioItems?.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                        <img src={item.image_url} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                      </div>
                    ))}
                    {(!portfolioItems || portfolioItems.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No portfolio items yet</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Recent Messages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contactMessages?.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="p-3 rounded-lg hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-foreground">{msg.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                      </div>
                    ))}
                    {(!contactMessages || contactMessages.length === 0) && (
                      <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === "portfolio" && (
            <div className="space-y-6">
              <Card className="border-border/30 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Add Portfolio Item</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Title" value={newPortfolio.title} onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <Input placeholder="Image URL" value={newPortfolio.image_url} onChange={(e) => setNewPortfolio({ ...newPortfolio, image_url: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <Input placeholder="Category" value={newPortfolio.category} onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <div className="flex items-end">
                      <Button onClick={() => addPortfolio.mutate(newPortfolio)} disabled={!newPortfolio.title || !newPortfolio.image_url} className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add Item
                      </Button>
                    </div>
                  </div>
                  <Textarea placeholder="Description" value={newPortfolio.description} onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })} className="mt-4 bg-secondary/50 border-border/30" />
                </CardContent>
              </Card>

              <div className="grid gap-3">
                {portfolioItems?.map((item) => (
                  <Card key={item.id} className="border-border/30 bg-card/50 hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.description}</p>}
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => deletePortfolio.mutate(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {(!portfolioItems || portfolioItems.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No portfolio items yet. Add your first one above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <Card className="border-border/30 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Add Gallery Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input placeholder="Image URL" value={newGallery.image_url} onChange={(e) => setNewGallery({ ...newGallery, image_url: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <Input placeholder="Alt Text" value={newGallery.alt_text} onChange={(e) => setNewGallery({ ...newGallery, alt_text: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <Button onClick={() => addGallery.mutate(newGallery)} disabled={!newGallery.image_url}>
                      <Plus className="h-4 w-4 mr-2" /> Add Image
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages?.map((img) => (
                  <Card key={img.id} className="border-border/30 bg-card/50 overflow-hidden group relative">
                    <img src={img.image_url} alt={img.alt_text || ""} className="w-full aspect-square object-cover" />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => deleteGallery.mutate(img.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {img.alt_text && (
                      <div className="p-2">
                        <p className="text-xs text-muted-foreground truncate">{img.alt_text}</p>
                      </div>
                    )}
                  </Card>
                ))}
                {(!galleryImages || galleryImages.length === 0) && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No gallery images yet. Add your first one above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <Card className="border-border/30 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg">Add Experience Entry</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Year (e.g., 2024)" value={newExperience.year} onChange={(e) => setNewExperience({ ...newExperience, year: e.target.value })} className="bg-secondary/50 border-border/30" />
                    <Input placeholder="Title" value={newExperience.title} onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })} className="bg-secondary/50 border-border/30" />
                  </div>
                  <Textarea placeholder="Description" value={newExperience.description} onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })} className="mt-4 bg-secondary/50 border-border/30" />
                  <Button onClick={() => addExperience.mutate(newExperience)} disabled={!newExperience.year || !newExperience.title} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" /> Add Entry
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {experienceEntries?.map((entry) => (
                  <Card key={entry.id} className="border-border/30 bg-card/50 hover:bg-card/80 transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-display font-bold text-sm">{entry.year}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{entry.title}</h3>
                        {entry.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>}
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteExperience.mutate(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {(!experienceEntries || experienceEntries.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>No experience entries yet. Add your first one above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-3">
              {contactMessages?.map((msg) => (
                <Card key={msg.id} className="border-border/30 bg-card/50 hover:bg-card/80 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-primary text-sm font-bold">{msg.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{msg.name}</h3>
                            <p className="text-xs text-primary">{msg.email}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground pl-11">{msg.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-2 pl-11">
                          {new Date(msg.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0" onClick={() => deleteMessage.mutate(msg.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!contactMessages || contactMessages.length === 0) && (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No messages yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
