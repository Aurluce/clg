import type {
  Chapel, Sermon, Testimony, Convention, Book, EvangelizationCampaign, ChoirSong,
} from "@/types/content";

// À remplacer par des appels à l'API Django (GET /api/chapels, /api/sermons, ...)

export const chapels: Chapel[] = [
  { slug: "douala-centre", name: "CLG Douala", country: "Cameroun", city: "Douala", pastorName: "Pasteur Jean ", contact: "+237 6XX XXX XXX" },
  { slug: "yaounde-nord", name: "CLG Yaoundé ", country: "Cameroun", city: "Yaoundé", pastorName: "Pasteur Paul ", contact: "+237 6XX XXX XXX" },
  { slug: "bafoussam", name: "CLG Bafoussam", country: "Cameroun", city: "Bafoussam", pastorName: "Pasteur Samuel ", contact: "+237 6XX XXX XXX" },
  { slug: "cote d'ivoire", name: "CLG Côte d'ivoire", country: "Cote d'ivoire", city: "//", pastorName: "Pasteur Élie ", contact: "+... 6XX XXX XXX" },
];

export const sermons: Sermon[] = [
  { id: "s1", title: "L'appui et la colonne de la vérité", chapelSlug: "douala-centre", chapelName: "CLG Douala Centre", preacher: "Pasteur Jean Mbarga", date: "2026-08-10", format: "video" },
  { id: "s2", title: "Recommencer avec Jésus", chapelSlug: "yaounde-nord", chapelName: "CLG Yaoundé ", preacher: "Pasteur Paul ", date: "2026-08-03", format: "audio" },
  { id: "s3", title: "Marcher dans la vérité", chapelSlug: "bafoussam", chapelName: "CLG Bafoussam", preacher: "Pasteur Samuel ", date: "2026-07-27", format: "video" },
];

export const testimonies: Testimony[] = [
  { id: "t1", authorName: "Marie A.", chapelName: "CLG Douala Centre", format: "texte", excerpt: "Dieu a transformé ma famille...", content: "Dieu a transformé ma famille depuis que j'ai rejoint la CLG. Ce témoignage complet sera à rédiger avec l'auteur.", date: "2026-08-12" },
  { id: "t2", authorName: "Emmanuel K.", chapelName: "CLG Cote d'ivoire", format: "video", excerpt: "Un nouveau départ après des années difficiles...", content: "Témoignage vidéo — contenu à intégrer.", date: "2026-08-05" },
];

export const conventions: Convention[] = [
  { slug: "convention-2026", title: "Convention Nationale 2026", year: 2026, status: "nouvelle", location: "Yaoundé, Cameroun", startDate: "2026-12-24", endDate: "2026-12-27", program: ["Ouverture et louange", "Enseignement de l'apôtre", "Soirée de témoignages", "Clôture et envoi"] },
  { slug: "convention-2025", title: "Convention Nationale 2025", year: 2025, status: "ancienne", location: "Yaoundé, Cameroun", startDate: "2025-12-19", endDate: "2025-12-22", program: ["Ouverture et louange", "Enseignement de l'apôtre", "Soirée de témoignages", "Clôture et envoi"] },
];

export const books: Book[] = [
  { id: "b1", title: "L'appui et la colonne de la vérité", description: "Ouvrage de l'apôtre T. Beaudelaire — description à compléter." },
  { id: "b2", title: "Recommencer avec Jésus", description: "Ouvrage de l'apôtre T. Beaudelaire — description à compléter." },
];

export const campaigns: EvangelizationCampaign[] = [
  { id: "c1", title: "Croisade de Douala", location: "Douala, Cameroun", date: "2026-09-05", description: "Une semaine d'évangélisation dans les quartiers de Douala." },
  { id: "c2", title: "Croisade de Bafoussam", location: "Bafoussam, Cameroun", date: "2026-10-12", description: "Programme d'évangélisation et de visites communautaires." },
];

export const choirSongs: ChoirSong[] = [
  { id: "ch1", title: "Gloire à Dieu", chapelName: "Chorale CLG Douala", format: "texte", lyricsExcerpt: "Paroles à intégrer avec la chorale." },
  { id: "ch2", title: "Recommencer", chapelName: "Chorale CLG Yaoundé", format: "video" },
];
