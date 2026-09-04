"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, Heart, BookmarkCheck, Building2 } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import type { HomepageContentRecord } from "@/features/cms/types/homepage-content";
import type { CmsSettingsRecord } from "@/features/cms/types/cms-settings";
import { HeroBannerForm } from "./forms/hero-banner-form";
import { WelcomeSpeechForm } from "./forms/welcome-speech-form";
import { DonationCtaForm } from "./forms/donation-cta-form";
import { FeaturedContentForm } from "./forms/featured-content-form";
import { MosqueIdentityForm } from "./forms/mosque-identity-form";

type TabKey = "hero" | "welcome" | "donation" | "featured" | "identity";

interface CmsBerandaViewProps {
  homepageContent: HomepageContentRecord;
  cmsSettings: CmsSettingsRecord;
  announcementOptions: Array<{ id: string; label: string }>;
  eventOptions: Array<{ id: string; label: string }>;
}

const TABS: Array<{ id: TabKey; label: string; icon: typeof Sparkles }> = [
  { id: "hero", label: "Banner Utama", icon: Sparkles },
  { id: "welcome", label: "Sambutan DKM", icon: MessageSquare },
  { id: "donation", label: "Program Donasi", icon: Heart },
  { id: "featured", label: "Konten Unggulan", icon: BookmarkCheck },
  { id: "identity", label: "Identitas & Kontak", icon: Building2 },
];

export function CmsBerandaView({
  homepageContent,
  cmsSettings,
  announcementOptions,
  eventOptions,
}: CmsBerandaViewProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("hero");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Clean Top Header */}
      <PageHeader
        title="CMS Beranda & Konten Publik"
        description="Kelola teks banner utama, sambutan ketua DKM, ajakan donasi, dan identitas resmi masjid yang ditampilkan di halaman beranda."
      />

      {/* Modern Segmented Navigation Tabs */}
      <div className="w-full overflow-x-auto pb-2 -mb-2">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 min-w-max">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="w-full">
        {activeTab === "hero" && (
          <HeroBannerForm initialData={homepageContent} />
        )}
        {activeTab === "welcome" && (
          <WelcomeSpeechForm initialData={homepageContent} />
        )}
        {activeTab === "donation" && (
          <DonationCtaForm initialData={homepageContent} />
        )}
        {activeTab === "featured" && (
          <FeaturedContentForm
            initialData={homepageContent}
            announcementOptions={announcementOptions}
            eventOptions={eventOptions}
          />
        )}
        {activeTab === "identity" && (
          <MosqueIdentityForm initialData={cmsSettings} />
        )}
      </div>
    </div>
  );
}
