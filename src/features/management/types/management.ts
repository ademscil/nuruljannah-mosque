export type ManagementMemberItem = {
  id: string;
  name: string;
  position: string;
  phone: string | null;
  email: string | null;
  termPeriod: string;
  photoUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  source: "database" | "fallback";
};
