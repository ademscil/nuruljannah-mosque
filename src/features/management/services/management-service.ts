import { findManagementMembers } from "@/features/management/repositories/management-repository";
import type { ManagementMemberItem } from "@/features/management/types/management";

export async function getManagementMembers(): Promise<ManagementMemberItem[]> {
  try {
    const members = await findManagementMembers();
    return members.map((member) => ({
      id: member.id,
      name: member.name,
      position: member.position,
      phone: member.phone ?? null,
      email: member.email ?? null,
      termPeriod: member.termPeriod,
      photoUrl: member.photoUrl ?? null,
      status: member.status,
    }));
  } catch (error) {
    console.error("Failed to load management members:", error);
    return [];
  }
}

export async function getPublicManagementMembers(): Promise<ManagementMemberItem[]> {
  const members = await getManagementMembers();
  return members.filter((item) => item.status === "PUBLISHED");
}
