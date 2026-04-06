import { findManagementMembers } from "@/features/management/repositories/management-repository";
import type { ManagementMemberItem } from "@/features/management/types/management";

const fallbackMembers: ManagementMemberItem[] = [
  {
    id: "management-demo-1",
    name: "Ahmad Fauzi",
    position: "Ketua DKM",
    phone: "081234567890",
    email: "admin@nuruljannah.id",
    termPeriod: "2025 - 2028",
    photoUrl: null,
    status: "PUBLISHED",
    source: "fallback",
  },
  {
    id: "management-demo-2",
    name: "Nur Aini",
    position: "Bendahara",
    phone: "081245678901",
    email: "bendahara@nuruljannah.id",
    termPeriod: "2025 - 2028",
    photoUrl: null,
    status: "PUBLISHED",
    source: "fallback",
  },
];

export async function getManagementMembers(): Promise<ManagementMemberItem[]> {
  try {
    const members = await findManagementMembers();

    if (members.length === 0) {
      return fallbackMembers;
    }

    return members.map((member) => ({
      id: member.id,
      name: member.name,
      position: member.position,
      phone: member.phone ?? null,
      email: member.email ?? null,
      termPeriod: member.termPeriod,
      photoUrl: member.photoUrl ?? null,
      status: member.status,
      source: "database",
    }));
  } catch {
    return fallbackMembers;
  }
}
