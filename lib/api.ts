import type {
  Book,
  Chapel,
  ChoirSong,
  Convention,
  EvangelizationCampaign,
  Sermon,
  Testimony,
} from "@/types/content";
import type { AuthUser } from "@/types/user";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "")
).replace(/\/+$/, "");

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
  const isPublicAuthRequest = [
    "/api/auth/token/",
    "/api/auth/token/refresh/",
    "/api/auth/register/",
  ].includes(path);
  if (accessToken && !isPublicAuthRequest && !headers.has("Authorization")) {
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
  },
  contact: {
    send: (payload: ContactPayload) =>
      postJson<{ message?: string }>("/api/contact/", payload),
  },
  conventions: {
    register: (slug: string, payload: ConventionRegistrationPayload) =>
      postJson<{ message?: string }>(
        `/api/conventions/${encodeURIComponent(slug)}/register/`,
        payload,
      ),
  },
  testimonies: {
    create: (payload: FormData) =>
      request<{ message?: string }>("/api/testimonies/", {
        method: "POST",
        body: payload,
      }),
  },
  donations: {
    create: (payload: DonationPayload) =>
      postJson<{ paymentUrl?: string; message?: string }>("/api/donations/", payload),
  },
  content: {
    chapels: () => request<Chapel[]>("/api/chapels/"),
    sermons: () => request<Sermon[]>("/api/sermons/"),
    testimonies: () => request<Testimony[]>("/api/testimonies/"),
    conventions: () => request<Convention[]>("/api/conventions/"),
    books: () => request<Book[]>("/api/books/"),
    campaigns: () => request<EvangelizationCampaign[]>("/api/campaigns/"),
    choirSongs: (slug: string) =>
      request<ChoirSong[]>(`/api/conventions/${encodeURIComponent(slug)}/choir-songs/`),
  },
};