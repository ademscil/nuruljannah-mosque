"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  MessageSquare, 
  Heart, 
  Settings, 
  Sparkles,
  FileText
} from "lucide-react";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";
import { HeroSectionForm } from "./sections/hero-section-form";
import { WelcomeSectionForm } from "./sections/welcome-section-form";
import { DonationSectionForm } from "./sections/donation-section-form";
import { FeaturedContentForm } from "./sections/featured-content-form";
import { GlobalSettingsForm } from "./sections/global-settings-form";

type CmsBerandaModernLayoutProps = {
  homepageContent: HomepageContentRecord;
  cmsSettings: CmsSettingsRecord;
  announcementOptions: Array<{ id: string; label: string }>;
  eventOptions: Array<{ id: string; label: string }>;
};

export function CmsBerandaModernLayout({
  homepageContent,
  cmsSettings,
  announcementOptions,
  eventOptions,
}: CmsBerandaModernLayoutProps) {
  const [activeTab, setActiveTab] = useState("hero");

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Header */}
      <div className="gradient-mesh-primary relative overflow-hidden rounded-3xl p-8 md:p-12 mb-8 shadow-depth-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-depth-sm">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-primary/70 uppercase tracking-wider">
                CMS Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                Kelola Halaman Beranda
              </h1>
            </div>
          </div>
          <p className="text-lg text-primary/80 max-w-3xl">
            Atur tampilan halaman utama website masjid dengan mudah. Pilih bagian yang ingin diubah di tab di bawah.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-0" />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-6 px-6 py-4 shadow-sm">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 bg-muted/50 p-2 rounded-2xl h-auto">
            <TabsTrigger 
              value="hero" 
              className="card-3d-advanced data-[state=active]:bg-white data-[state=active]:shadow-depth-md rounded-xl py-3 px-4 transition-all"
            >
              <Home className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Banner Utama</span>
              <span className="sm:hidden">Banner</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="welcome"
              className="card-3d-advanced data-[state=active]:bg-white data-[state=active]:shadow-depth-md rounded-xl py-3 px-4 transition-all"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Sambutan</span>
              <span className="sm:hidden">Sambutan</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="donation"
              className="card-3d-advanced data-[state=active]:bg-white data-[state=active]:shadow-depth-md rounded-xl py-3 px-4 transition-all"
            >
              <Heart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Donasi</span>
              <span className="sm:hidden">Donasi</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="featured"
              className="card-3d-advanced data-[state=active]:bg-white data-[state=active]:shadow-depth-md rounded-xl py-3 px-4 transition-all"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Konten Pilihan</span>
              <span className="sm:hidden">Pilihan</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="global"
              className="card-3d-advanced data-[state=active]:bg-white data-[state=active]:shadow-depth-md rounded-xl py-3 px-4 transition-all"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pengaturan Global</span>
              <span className="sm:hidden">Global</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="hero" className="space-y-6 mt-8">
          <HeroSectionForm 
            initialData={homepageContent}
          />
        </TabsContent>

        <TabsContent value="welcome" className="space-y-6 mt-8">
          <WelcomeSectionForm 
            initialData={homepageContent}
          />
        </TabsContent>

        <TabsContent value="donation" className="space-y-6 mt-8">
          <DonationSectionForm 
            initialData={homepageContent}
          />
        </TabsContent>

        <TabsContent value="featured" className="space-y-6 mt-8">
          <FeaturedContentForm 
            initialData={homepageContent}
            announcementOptions={announcementOptions}
            eventOptions={eventOptions}
          />
        </TabsContent>

        <TabsContent value="global" className="space-y-6 mt-8">
          <GlobalSettingsForm 
            initialData={cmsSettings}
          />
        </TabsContent>
      </Tabs>

      {/* Help Guide */}
      <div className="mt-12 glass-frosted rounded-2xl p-6 shadow-depth-md">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Tips Penggunaan
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Banner Utama:</strong> Ubah judul dan teks sambutan di bagian paling atas website</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Sambutan:</strong> Tulis pesan dari takmir atau pengurus masjid</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Donasi:</strong> Ajak jamaah untuk berdonasi dengan pesan yang menarik</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Konten Pilihan:</strong> Pilih pengumuman atau agenda yang ditampilkan di beranda</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span><strong>Pengaturan Global:</strong> Atur informasi masjid, kontak, dan elemen website lainnya</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
