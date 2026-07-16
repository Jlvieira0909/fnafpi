export type Continuity = "games" | "novels" | "frights" | "movies" | "meta";

export type Canonicity = "confirmed" | "implied" | "theory";

export interface LoreClaim {
  value: string;
  canonicity: Canonicity;
  continuity: Continuity;
  source?: string;
}

export interface PlatformRelease {
  platform: string;
  releaseDate?: string;
}

export type MediaType = "Game" | "DLC" | "Book" | "Movie";

export type BookType =
  | "novel"
  | "anthology"
  | "graphic-novel"
  | "guide"
  | "interactive-novel"
  | "companion";

export interface Credits {
  developer?: string;
  publisher?: string;
  authors?: string[];
  illustrator?: string;
  director?: string;
  writers?: string[];
  producers?: string[];
  studio?: string;
  cast?: { actor: string; role: string }[];
}

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  imageUrl: string;
  releaseDate: string | null;
  continuity: Continuity;
  mainSeries?: boolean;
  parentId?: string;
  series?: string;
  seriesNumber?: number;
  bookType?: BookType;
  adaptationOf?: string;
  credits: Credits;
  platforms?: PlatformRelease[];
  notes?: string[];
}

export type CharacterType = "Human" | "Animatronic";

export interface Character {
  id: string;
  type: CharacterType;
  name: string;
  continuity: Continuity;
  variantOf?: string;
  counterparts?: string[];
  imageUrl: string;
  gender?: string;
  color?: string;
  group?: string;
  possessedBy?: LoreClaim;
  status?: LoreClaim;
  debut: string;
  appearances: string[];
  notes?: string[];
}

export type LocationStatus =
  | "Active"
  | "Closed"
  | "Burned"
  | "Demolished"
  | "Unknown";

export interface Incident {
  name: string;
  year?: string;
  description: string;
  canonicity: Canonicity;
  source?: string;
}

export interface Location {
  id: string;
  name: string;
  continuity: Continuity;
  imageUrl: string;
  status: LocationStatus;
  causeOfClosure?: string;
  incidents?: Incident[];
  rooms?: string[];
  owner?: string;
  presentCharacters: string[];
  appearances: string[];
  notes?: string[];
}

export interface Teaser {
  id: string;
  title: string;
  imageUrl: string;
  postedDate: string | null;
  source: string;
  teases?: string;
  hiddenContent?: string;
  description?: string;
  notes?: string[];
}
