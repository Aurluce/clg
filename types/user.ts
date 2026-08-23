export type SystemRole = "SUPER_ADMIN" | "PASTOR_ADMIN" | "DEVELOPER" | "MEMBER";
export type SoulStatus = "SIMPLE_FIDELE" | "ASPIRANT" | "DIACRE" | "ENUQUE" | "PASTEUR";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  systemRole: SystemRole;
  soulStatus?: SoulStatus;
  chapelId?: string;
}