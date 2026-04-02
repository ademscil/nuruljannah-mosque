import { PublicFooter } from "@/components/layouts/public-footer";
import { PublicHeader } from "@/components/layouts/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main className="mx-auto min-h-[calc(100vh-160px)] max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
