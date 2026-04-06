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
      <Card className="page-shell rounded-[1.8rem] border-0 shadow-none">
        <CardContent className="space-y-4 p-8">
          <p className="text-sm leading-7 text-muted-foreground">
            Halaman ini sudah memakai shell dashboard yang sama dengan modul lain
            dan siap diisi dengan kebutuhan operasional tambahan ketika diperlukan.
          </p>
          <Button variant="outline" className="rounded-full">
            Modul siap dikembangkan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
