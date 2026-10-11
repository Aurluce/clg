import type {
  Book,
  Chapel,
  ChapelDetail,
  ChoirSong,
  ChurchPageContent,
  Convention,
  EvangelizationCampaign,
  MemberChapel,
  Sermon,
  Testimony,
  TestimonyComment,
} from "@/types/content";
import type { AuthUser, UserProfile } from "@/types/user";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "")
).replace(/\/+$/, "");

export const ADMIN_DASHBOARD_URL = `${API_BASE_URL}/admin/`;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  const accessToken = getAccessToken();
  const isPublicRequest = [
    "/api/auth/token/",
    "/api/auth/token/refresh/",
    "/api/auth/register/",
    "/api/church-page/",
    "/api/chapels/",
    "/api/sermons/",
    "/api/testimonies/",
    "/api/conventions/",
    "/api/books/",
    "/api/campaigns/",
    "/api/contact/",
    "/api/donations/",
  ].includes(path);
  const isPublicChapelDetail = /^\/api\/chapels\/[^/]+\/$/.test(path);
  const isPublicSermonDetail = /^\/api\/sermons\/[^/]+\/$/.test(path);
  const isPublicTestimonyDetail = /^\/api\/testimonies\/\d+\/$/.test(path);
  const isPublicTestimonyCommentsRead = /^\/api\/testimonies\/\d+\/comments\/$/.test(path) && init.method !== "POST";
  if (accessToken && !isPublicRequest && !isPublicChapelDetail && !isPublicSermonDetail && !isPublicTestimonyDetail && !isPublicTestimonyCommentsRead && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload: unknown = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    const details = formatApiError(payload, response.status);
    throw new ApiError(details, response.status);
  }

  if (response.status === 204) return undefined as T;
  return payload as T;
}

const AUTH_SESSION_KEY = "clg.auth.session";
const AUTH_STATE_EVENT = "clg:auth-state-change";

function notifyAuthStateChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_STATE_EVENT));
  }
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const rawSession = window.sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!rawSession) return null;
    const session = JSON.parse(rawSession) as Partial<AuthTokens>;
    return typeof session.access === "string" ? session.access : null;
  } catch {
    return null;
  }
}

function formatApiError(payload: unknown, status: number): string {
  if (typeof payload === "string" && payload.length > 0) return payload;
  if (typeof payload !== "object" || payload === null) {
    return `La requête a échoué (${status}).`;
  }

  const body = payload as Record<string, unknown>;
  const preferred = body.detail ?? body.message ?? body.non_field_errors;
  if (typeof preferred === "string") return preferred;
  if (Array.isArray(preferred)) return preferred.map(String).join(" ");

  const fieldErrors = Object.entries(body)
    .map(([field, errors]) => {
      const message = Array.isArray(errors) ? errors.map(String).join(" ") : String(errors);
      return `${field}: ${message}`;
    })
    .join(" ");
  return fieldErrors || `La requête a échoué (${status}).`;
}

function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export interface AuthTokens {
  access: string;
  refresh?: string;
  user?: AuthUser;
}

export interface RegistrationPayload {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  churchStatus: string;
  chapelSlug?: string;
  password: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ConventionRegistrationPayload {
  name: string;
  chapel: string;
  phone: string;
  attendees: number;
}

export interface DonationPayload {
  amount: number;
  currency: "XAF";
}

export interface DashboardActivity {
  kind: "testimony" | "convention" | "donation";
  title: string;
  description: string;
  date: string;
  status: string;
  href: string;
}

export interface MemberDashboardData {
  member: UserProfile;
  stats: {
    testimonies: number;
    pendingTestimonies: number;
    conventionRegistrations: number;
    successfulDonations: number;
    successfulDonationTotal: string;
    publishedSermons: number;
    activeChapels: number;
    upcomingConventions: number;
  };
  recentActivity: DashboardActivity[];
  sermons: Sermon[];
  conventions: Convention[];
  events: EvangelizationCampaign[];
}

export interface PastorMemberRecord {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  churchStatus: string;
  chapelId: string | null;
  chapelName: string | null;
  dateJoined: string;
  isActive: boolean;
  isVerified: boolean;
  isApproved: boolean;
}

export interface PastorActivityRecord {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  chapelName: string;
  created_at: string;
}

export interface PastorTestimonyRecord {
  id: number;
  title: string;
  authorName: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  content: string;
}

export interface PastorDashboardOverview {
  pastor: { fullName: string; email: string };
  chapel: { name: string; city: string; country: string } | null;
  stats: {
    activeMembers: number;
    newMembersThisMonth: number;
    memberGrowthPercent: number;
    publishedSermons: number;
    pendingTestimonies: number;
    upcomingActivities: number;
    donationsThisMonth: string;
    donationCountThisMonth: number;
  };
  monthly: { month: string; members: number; donations: string }[];
  nextSunday: {
    date: string;
    activity: PastorActivityRecord | null;
  };
  upcomingActivities: PastorActivityRecord[];
}

export interface PastorSermonRecord extends Sermon {
  preacherId: number;
  isPublished: boolean;
  mediaType: "TEXT" | "AUDIO" | "VIDEO";
}

export interface PastorPreacherChoice {
  id: number;
  fullName: string;
  email: string;
  churchStatus: string;
  systemRole: string;
}

export interface PastorSermonChapelChoice {
  id: number;
  slug: string;
  name: string;
  city: string;
  country: string;
}

export const api = {
  auth: {
    login: async (payload: { email: string; password: string }) => {
      const session = await postJson<AuthTokens>("/api/auth/token/", payload);
      if (!session.access) throw new ApiError("Le serveur n’a pas renvoyé de jeton d’accès.", 502);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
        notifyAuthStateChanged();
      }
      return session;
    },
    register: (payload: RegistrationPayload) =>
      postJson<{ user?: AuthUser; message?: string }>("/api/auth/register/", payload),
    logout: () => {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(AUTH_SESSION_KEY);
        notifyAuthStateChanged();
      }
    },
    onSessionChange: (callback: () => void) => {
      if (typeof window === "undefined") return () => undefined;
      window.addEventListener(AUTH_STATE_EVENT, callback);
      return () => window.removeEventListener(AUTH_STATE_EVENT, callback);
    },
    currentSession: (): AuthTokens | null => {
      if (typeof window === "undefined") return null;
      try {
        const rawSession = window.sessionStorage.getItem(AUTH_SESSION_KEY);
        return rawSession ? (JSON.parse(rawSession) as AuthTokens) : null;
      } catch {
        return null;
      }
    },
    currentUser: () => request<AuthUser>("/api/auth/me/"),
    dashboard: () => request<MemberDashboardData>("/api/auth/dashboard/"),
    myChapel: () => request<{ chapel: MemberChapel | null }>("/api/auth/my-chapel/"),
    profile: () => request<UserProfile>("/api/auth/profile/"),
    updateProfile: (payload: FormData) =>
      request<UserProfile>("/api/auth/profile/", { method: "PATCH", body: payload }),
    changePassword: (payload: { currentPassword: string; newPassword: string }) =>
      postJson<{ message?: string }>("/api/auth/password/", payload),
    updateCachedUser: (user: AuthUser) => {
      if (typeof window === "undefined") return;
      const session = api.auth.currentSession();
      if (!session) return;
      window.sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ ...session, user }));
      notifyAuthStateChanged();
    },
  },
  contact: {
    send: (payload: ContactPayload) =>
      postJson<{ message?: string }>("/api/contact/", payload),
  },
  pastor: {
    dashboard: () => request<PastorDashboardOverview>("/api/pastor/dashboard/"),
    sermonChapels: () => request<PastorSermonChapelChoice[]>("/api/pastor/sermons/options/chapels/"),
    sermonPreachers: (chapelSlug: string) =>
      request<PastorPreacherChoice[]>(`/api/pastor/sermons/options/chapels/${encodeURIComponent(chapelSlug)}/preachers/`),
    sermons: () => request<PastorSermonRecord[]>("/api/pastor/sermons/"),
    createSermon: (payload: FormData) =>
      request<PastorSermonRecord>("/api/pastor/sermons/", { method: "POST", body: payload }),
    updateSermon: (id: string, payload: FormData) =>
      request<PastorSermonRecord>(`/api/pastor/sermons/${encodeURIComponent(id)}/`, { method: "PATCH", body: payload }),
    deleteSermon: (id: string) =>
      request<void>(`/api/pastor/sermons/${encodeURIComponent(id)}/`, { method: "DELETE" }),
    members: () => request<PastorMemberRecord[]>("/api/pastor/members/"),
    createMember: (payload: Record<string, string>) =>
      postJson<PastorMemberRecord>("/api/pastor/members/", payload),
    updateMember: (id: string, payload: Record<string, string | boolean>) =>
      request<PastorMemberRecord>(`/api/pastor/members/${encodeURIComponent(id)}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    deactivateMember: (id: string) =>
      request<void>(`/api/pastor/members/${encodeURIComponent(id)}/`, { method: "DELETE" }),
    activities: () => request<PastorActivityRecord[]>("/api/pastor/activities/"),
    createActivity: (payload: Record<string, string>) =>
      postJson<PastorActivityRecord>("/api/pastor/activities/", payload),
    updateActivity: (id: number, payload: Record<string, string>) =>
      request<PastorActivityRecord>(`/api/pastor/activities/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    deleteActivity: (id: number) =>
      request<void>(`/api/pastor/activities/${id}/`, { method: "DELETE" }),
    testimonies: () => request<PastorTestimonyRecord[]>("/api/pastor/testimonies/"),
    moderateTestimony: (id: number, status: PastorTestimonyRecord["status"]) =>
      request<{ id: number; status: PastorTestimonyRecord["status"] }>(`/api/pastor/testimonies/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
  },
  conventions: {
    register: (slug: string, payload: ConventionRegistrationPayload) =>
      postJson<{ message?: string }>(
        `/api/conventions/${encodeURIComponent(slug)}/register/`,
        payload,
      ),
  },
  testimonies: {
    list: (filters: { format?: string; chapel?: string; q?: string } = {}) => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      const query = params.toString();
      return request<Testimony[]>(`/api/testimonies/${query ? `?${query}` : ""}`);
    },
    get: (id: string) => request<Testimony>(`/api/testimonies/${encodeURIComponent(id)}/`),
    create: (payload: FormData) =>
      request<{ message?: string }>("/api/testimonies/", {
        method: "POST",
        body: payload,
      }),
    comments: (id: string) => request<TestimonyComment[]>(`/api/testimonies/${encodeURIComponent(id)}/comments/`),
    addComment: (id: string, content: string) =>
      postJson<{ message?: string }>(`/api/testimonies/${encodeURIComponent(id)}/comments/`, { content }),
  },
  donations: {
    create: (payload: DonationPayload) =>
      postJson<{ paymentUrl?: string; message?: string }>("/api/donations/", payload),
  },
  content: {
    churchPage: () => request<ChurchPageContent>("/api/church-page/"),
    chapels: () => request<Chapel[]>("/api/chapels/"),
    chapel: (slug: string) =>
      request<ChapelDetail>(`/api/chapels/${encodeURIComponent(slug)}/`),
    sermons: () => request<Sermon[]>("/api/sermons/"),
    sermon: (idOrSlug: string) =>
      request<Sermon>(`/api/sermons/${encodeURIComponent(idOrSlug)}/`),
    testimonies: () => request<Testimony[]>("/api/testimonies/"),
    conventions: () => request<Convention[]>("/api/conventions/"),
    books: () => request<Book[]>("/api/books/"),
    campaigns: () => request<EvangelizationCampaign[]>("/api/campaigns/"),
    choirSongs: (slug: string) =>
      request<ChoirSong[]>(`/api/conventions/${encodeURIComponent(slug)}/choir-songs/`),
  },
};