import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardPlaceholderProps = {
  title: string;
  description: string;
};

export function DashboardPlaceholder({
  title,
  description,
}: DashboardPlaceholderProps) {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="CMS Internal" title={title} description={description} />
      <Card className="rounded-[2rem] border-border/60 shadow-sm">
        <CardContent className="space-y-4 p-8">
          <p className="text-sm leading-7 text-muted-foreground">
            Struktur route, layout dashboard, auth, role handling, schema data,
            dan reusable components sudah disiapkan. Tahap berikutnya tinggal
            menghubungkan CRUD, validasi, dan data Prisma.
          </p>
          <Button variant="outline" className="rounded-full">
            Lanjutkan implementasi fitur
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
