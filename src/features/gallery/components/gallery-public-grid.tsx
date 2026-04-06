import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateIndonesia } from "@/lib/format-date";
import type { GalleryItemRecord } from "@/features/gallery/types/gallery";

export function GalleryPublicGrid({ items }: { items: GalleryItemRecord[] }) {
  if (items.length === 0) {
    return <EmptyState icon={ImageIcon} title="Belum ada galeri kegiatan" description="Dokumentasi kegiatan akan tampil setelah dipublikasikan pengurus." />;
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, i) => (
        <article
          key={item.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-scale-in card-elevated group overflow-hidden p-0"
        >
          <div className="relative h-56 w-full overflow-hidden bg-muted">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                {item.category}
              </span>
            </div>
          </div>
          <div className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{item.category}</p>
            <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight">{item.title}</h3>
            <p className="mt-1.5 text-xs text-muted-foreground">{formatDateIndonesia(item.activityDate)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
