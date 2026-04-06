import { Mail, Phone, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ManagementMemberItem } from "@/features/management/types/management";

function getInitials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-primary/10 text-primary",
  "bg-amber-50 text-amber-700",
  "bg-teal-50 text-teal-700",
  "bg-violet-50 text-violet-700",
  "bg-rose-50 text-rose-700",
];

export function ManagementPublicGrid({ members }: { members: ManagementMemberItem[] }) {
  if (members.length === 0) {
    return <EmptyState icon={Users} title="Data pengurus belum tersedia" description="Daftar pengurus akan ditampilkan setelah dipublikasikan dari dashboard admin." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {members.map((member, i) => (
        <article
          key={member.id}
          style={{ animationDelay: `${i * 60}ms` }}
          className="animate-fade-up card-elevated group p-6 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold transition-transform duration-300 group-hover:scale-105 ${avatarColors[i % avatarColors.length]}`}>
              {getInitials(member.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold leading-snug tracking-tight">{member.name}</h3>
                  <p className="mt-0.5 text-sm font-medium text-primary">{member.position}</p>
                </div>
                <StatusBadge label="Aktif" value={member.status} />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <p className="text-xs">Periode: {member.termPeriod}</p>
            {member.phone && (
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0 text-primary/60" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0 text-primary/60" />
                <span className="truncate">{member.email}</span>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
