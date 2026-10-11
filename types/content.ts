export interface Chapel {
  id?: string;
  slug: string;
  name: string;
  country: string;
  region?: string;
  city: string;
  address?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  pastorName: string;
  contact: string;
}

export interface ChapelActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string | null;
}

export interface MemberChapel {
  name: string;
  slug: string;
  region: string;
  country: string;
  city: string;
  address: string;
  latitude: string | null;
  longitude: string | null;
  phone: string;
  email: string;
  description: string;
  pastorName: string | null;
  memberCount: number;
  activities: ChapelActivity[];
  sermons: Sermon[];
  events: EvangelizationCampaign[];
  testimonies: Testimony[];
}

export type ChapelDetail = MemberChapel;

export interface ChurchPageContent {
  scriptureReference: string;
  heroTitle: string;
  heroSubtitle: string;
  scriptureQuote: string;
  genesis: string;
  vision: string;
  objectivesIntro: string;
  shortTermObjective: string;
  mediumTermObjective: string;
  longTermObjective: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  updatedAt: string;
}

export interface Sermon {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  chapelSlug: string | null;
  chapelName: string | null;
  preacher: string;
  date: string;
  format: "video" | "audio" | "texte";
  videoUrl: string | null;
  audioUrl: string | null;
  thumbnailUrl: string | null;
}

export interface Testimony {
  id: string;
  title?: string;
  authorName: string;
  chapelName?: string;
  chapelSlug?: string | null;
  format: "texte" | "audio" | "video";
  excerpt: string;
  content: string;
  date: string;
  audioUrl?: string | null;
  videoUrl?: string | null;
  commentCount?: number;
}

export interface TestimonyComment {
  id: number;
  authorName: string | null;
  content: string;
  date: string;
}

export interface Convention {
  slug: string;
  title: string;
  year: number;
  status: "ancienne" | "nouvelle";
  location: string;
  startDate: string;
  endDate: string;
  program: string[];
}

export interface Book {
  id: string;
  title: string;
  description: string;
}

export interface EvangelizationCampaign {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
}

export interface ChoirSong {
  id: string;
  title: string;
  chapelName: string;
  format: "texte" | "video";
  lyricsExcerpt?: string;
}
