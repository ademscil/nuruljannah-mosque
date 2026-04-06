import { Building2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="relative">
        <div className="size-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="size-6 text-primary" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">Memuat portal masjid...</p>
    </div>
  );
}
