import { CharacteristicKey, CharacteristicValues } from "./characteristics";

export type Species = {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  modifiers: Partial<CharacteristicValues>;
  randomizeXp: number;
  randomizeTable?: string;
  skills: string[];
  talents: string[];
  careers: string[];
  status: string[];
};

export const SPECIES: Species[] = [
  {
    id: "human",
    name: "Human",
    nameRu: "Человек",
    description:
      "Versatile and ambitious, humans are the most common race in the Old World.",
    modifiers: { wp: 5, fel: 5 },
    randomizeXp: 80,
    skills: [
      "common-knowledge-reikkland",
      "leadership",
      "animal-care",
      "charm",
      "evaluate",
      "brawling",
      "trade",
      "shoot-bow",
      "cool",
      "language-bretonnia",
      "language-wester",
    ],
    talents: ["fate", "quick-witted", "suave"],
    careers: ["any"],
    status: ["strider"],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    nameRu: "Гном",
    description:
      "Stout and hardy, dwarves are renowned craftsmen and warriors.",
    modifiers: { ws: 10, s: 5, t: 10, ag: -5, dex: 10, wp: 20 },
    randomizeXp: 70,
    skills: [
      "entertain-storytelling",
      "intimidate",
      "common-knowledge-geology",
      "common-knowledge-dwarfs",
      "common-knowledge-metallurgy",
      "consume-alcohol",
      "trade",
      "brawling",
      "endurance",
      "cool",
      "language-khazalid",
    ],
    talents: ["grudger", "night-vision", "stone-eye", "stubborn"],
    careers: ["any"],
    status: ["stoneheart", "tenacious"],
  },
  {
    id: "halfling",
    name: "Halfling",
    nameRu: "Полурослик",
    description:
      "Small and nimble, halflings are lucky folk with stealthy fingers.",
    modifiers: {
      ws: -5,
      s: -5,
      t: -5,
      ag: 5,
      dex: 10,
      int: 5,
      wp: 10,
      fel: 10,
    },
    randomizeXp: 70,
    skills: [
      "gamble",
      "common-knowledge-reikkland",
      "intuition",
      "consume-alcohol",
      "sleight-of-hand",
      "perception",
      "charm",
      "trade-cook",
      "stealth",
      "dodge",
      "language-mootish",
    ],
    talents: ["luck", "night-vision", "resistance-chaos", "small"],
    careers: ["any"],
    status: ["halfling-luck", "light-footed"],
  },
  {
    id: "high-elf",
    name: "High Elf",
    nameRu: "Высший эльф",
    description:
      "Graceful and long-lived, high elves are masters of magic and combat.",
    modifiers: { ws: 10, bs: 10, i: 20, ag: 10, dex: 10, int: 10, wp: 10 },
    randomizeXp: 50,
    skills: [
      "entertain-singing",
      "leadership",
      "musicianship",
      "perception",
      "orientation",
      "evaluate",
      "swim",
      "brawling",
      "shoot-bow",
      "cool",
      "sail",
      "language-aeltharin",
    ],
    talents: ["aetheric-attunement", "cool", "second-sight", "night-vision"],
    careers: ["any"],
    status: ["arcane-magic", "savant"],
  },
  {
    id: "wood-elf",
    name: "Wood Elf",
    nameRu: "Лесной эльф",
    description: "Cunning and swift, wood elves are at home in the forests.",
    modifiers: { ws: 10, bs: 10, i: 10, ag: 10, dex: 10, int: -5 },
    randomizeXp: 60,
    skills: [
      "athletics",
      "entertain-singing",
      "outdoor-survival",
      "track",
      "intimidate",
      "climb",
      "perception",
      "brawling",
      "stealth",
      "endurance",
      "shoot-bow",
      "language-aeltharin",
    ],
    talents: ["night-vision", "second-sight", "tracker", "very-resilient"],
    careers: ["any"],
    status: ["savannah-dweller", "tracker"],
  },
];

export const rollRandomSpecies = (): Species => {
  const roll = Math.floor(Math.random() * 100) + 1;
  if (roll <= 90) return SPECIES.find((s) => s.id === "human")!;
  if (roll <= 94) return SPECIES.find((s) => s.id === "halfling")!;
  if (roll <= 98) return SPECIES.find((s) => s.id === "dwarf")!;
  if (roll <= 99) return SPECIES.find((s) => s.id === "high-elf")!;
  return SPECIES.find((s) => s.id === "wood-elf")!;
};

export type SpeciesMovement = {
  speed: number;
  step: number;
  run: number;
};

export const SPECIES_MOVEMENT: Record<string, SpeciesMovement> = {
  human: { speed: 4, step: 8, run: 16 },
  dwarf: { speed: 3, step: 6, run: 12 },
  halfling: { speed: 3, step: 6, run: 12 },
  "high-elf": { speed: 5, step: 10, run: 20 },
  "wood-elf": { speed: 5, step: 10, run: 20 },
};

export const SPECIES_EXTRA_POINTS: Record<string, number> = {
  human: 3,
  dwarf: 2,
  halfling: 3,
  "high-elf": 2,
  "wood-elf": 2,
};

export const SPECIES_BASE_FATE: Record<string, number> = {
  human: 2,
  dwarf: 0,
  halfling: 0,
  "high-elf": 0,
  "wood-elf": 0,
};

export const getSpeciesById = (id: string): Species | undefined =>
  SPECIES.find((s) => s.id === id);
