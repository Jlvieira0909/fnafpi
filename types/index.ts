// types/index.ts

export type MediaType = "Game" | "Book" | "Movie";
export type CharacterType = "Human" | "Animatronic";

export interface Media {
  id: string;
  type: MediaType;
  title: string;
  imageUrl: string;
  releaseDate: string; // Formato YYYY-MM-DD
  credits: {
    developer?: string;
    author?: string;
    director?: string;
    actors?: string[];
  };
  platforms?: string[]; // Apenas para os jogos
}

export interface Character {
  id: string;
  type: CharacterType;
  name: string;
  imageUrl: string;
  gender?: string;
  color?: string;
  group?: string; // Ex: 'Toy', 'Withered', 'Glamrock'
  soul?: string; // Quem assombra o traje
  appearances: string[]; // Array com os IDs da coleção Media
}

export interface Location {
  id: string;
  name: string;
  imageUrl: string;
  status: "Active" | "Closed" | "Burned" | "Unknown";
  causeOfClosure?: string;
  presentCharacters: string[]; // Array com os IDs da coleção Characters
  appearances: string[]; // Array com os IDs da coleção Media
}
