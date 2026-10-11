export type SystemRole = "SUPER_ADMIN" | "PASTOR_ADMIN" | "DEVELOPER" | "MEMBER";
export type SoulStatus = "SIMPLE_FIDELE" | "ASPIRANT" | "DIACRE" | "ENUQUE" | "PASTEUR";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  systemRole: SystemRole;
  soulStatus?: SoulStatus;
  chapelId?: string | null;
}

export interface UserProfile extends AuthUser {
  phone: string;
  country: string;
  city: string;
  chapelName: string | null;
  chapelSlug: string | null;
  profilePhoto: string | null;
  isVerified: boolean;
  isApproved: boolean;
  dateJoined: string;
}