import type { Character, Location, Media, Teaser } from "@/types";

import bonnie from "@/data/characters/bonnie.json";
import freddy from "@/data/characters/freddy.json";
import chica from "@/data/characters/chica.json";
import foxy from "@/data/characters/foxy.json";
import funtime from "@/data/characters/funtime.json";
import puppetBb from "@/data/characters/puppet-bb.json";
import glamrockPizzaplex from "@/data/characters/glamrock-pizzaplex.json";
import ffpsUcn from "@/data/characters/ffps-ucn.json";
import booksCast from "@/data/characters/books.json";
import humans from "@/data/characters/humans.json";

import locationsData from "@/data/locations.json";
import teasersData from "@/data/teasers.json";

import gamesMedia from "@/data/media/games.json";
import booksMedia from "@/data/media/books.json";
import moviesMedia from "@/data/media/movies.json";

export const characters = [
  ...bonnie,
  ...freddy,
  ...chica,
  ...foxy,
  ...funtime,
  ...puppetBb,
  ...glamrockPizzaplex,
  ...ffpsUcn,
  ...booksCast,
  ...humans,
] as unknown as Character[];

export const media = [
  ...gamesMedia,
  ...booksMedia,
  ...moviesMedia,
] as unknown as Media[];

export const locations = locationsData as unknown as Location[];
export const teasers = teasersData as unknown as Teaser[];

export const charactersById = new Map(characters.map((c) => [c.id, c]));
export const mediaById = new Map(media.map((m) => [m.id, m]));
export const locationsById = new Map(locations.map((l) => [l.id, l]));
export const teasersById = new Map(teasers.map((t) => [t.id, t]));

export function variantsOf(id: string): string[] {
  return characters.filter((c) => c.variantOf === id).map((c) => c.id);
}

export function charactersIn(mediaId: string): string[] {
  return characters.filter((c) => c.appearances.includes(mediaId)).map((c) => c.id);
}
