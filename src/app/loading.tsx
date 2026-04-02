export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto size-12 animate-pulse rounded-full bg-emerald-600/20" />
        <p className="text-sm text-muted-foreground">Memuat portal masjid...</p>
      </div>
    </div>
  );
}
