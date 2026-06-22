import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Card3D } from "@/components/shared/card-3d";
import { formatDateIndonesia } from "@/lib/format-date";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

export function GalleryPublicGrid({ items }: { items: GalleryItemRecord[] }) {
  const publishedItems = items.filter((item) => item.status === "PUBLISHED");

  if (publishedItems.length === 0) {
    return <EmptyState icon={ImageIcon} title="Belum ada galeri kegiatan" description="Dokumentasi kegiatan akan tampil setelah dipublikasikan pengurus." />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 perspective-normal">
      {publishedItems.map((item, i) => (
        <Card3D
          key={item.id}
          variant="magnetic"
          delay={i * 0.08}
          className="group overflow-hidden p-0"
        >
          <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-muted to-muted/50">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
            {/* Enhanced overlay with 3D effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
            
            {/* Floating category badge */}
            <div className="absolute left-4 top-4 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
              <span className="badge-shimmer inline-flex items-center gap-1.5 rounded-full bg-white/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                <ImageIcon className="size-3" />
                {item.category}
              </span>
            </div>

            {/* Bottom info on hover */}
            <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="glass-ultra rounded-xl p-3">
                <p className="text-xs font-bold text-white/90">{formatDateIndonesia(item.activityDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="relative p-5 bg-gradient-to-br from-card to-muted/20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{item.category}</p>
            <h3 className="mt-2.5 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-primary">
              {item.title}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground">{formatDateIndonesia(item.activityDate)}</p>
          </div>
        </Card3D>
      ))}
    </div>
  );
}
