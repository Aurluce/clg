export interface Chapel {
  slug: string;
  name: string;
  country: string;
  city: string;
  pastorName: string;
  contact: string;
}

export interface Sermon {
  id: string;
  title: string;
  chapelSlug: string;
  chapelName: string;
  preacher: string;
  date: string;
  format: "video" | "audio";
}

export interface Testimony {
  id: string;
  authorName: string;
  chapelName?: string;
  format: "texte" | "audio" | "video";
  excerpt: string;
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
