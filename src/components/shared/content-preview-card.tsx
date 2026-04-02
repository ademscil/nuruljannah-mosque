import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ContentPreviewCardProps = {
  title: string;
  eyebrow?: string;
  description: string;
};

export function ContentPreviewCard({
  title,
  eyebrow,
  description,
}: ContentPreviewCardProps) {
  return (
    <Card className="glass-panel aurora-border rounded-[2rem] border-white/50 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.4)] transition duration-500 hover:translate-y-[-4px]">
      <CardHeader className="space-y-3">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
            {eyebrow}
          </p>
        ) : null}
        <CardTitle className="text-xl leading-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
