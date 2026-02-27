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
    skills: ["common-knowledge-reikkland", "language-wester"],
    talents: ["cool-headed-or-resolute"],
    careers: ["any"],
    status: ["strider"],
  },
  {
    id: "dwarf",
    name: "Dwarf",
    nameRu: "Гном",
    description:
      "Stout and hardy, dwarves are renowned craftsmen and warriors.",
    modifiers: { s: 5, t: 5, ag: -5 },
    randomizeXp: 70,
    skills: ["consume-alcohol", "trade-weapon"],
    talents: ["grim-composure", "night-vision"],
    careers: ["any"],
    status: ["stoneheart", "tenacious"],
  },
  {
    id: "halfling",
    name: "Halfling",
    nameRu: "Хафлинг",
    description:
      "Small and nimble, halflings are lucky folk with stealthy fingers.",
    modifiers: { s: -5, t: -5, ag: 10, dex: 5 },
    randomizeXp: 70,
    skills: ["ride-horse", "sleight-of-hand"],
    talents: ["luck", "second-wind"],
    careers: ["any"],
    status: ["halfling-luck", "light-footed"],
  },
  {
    id: "high-elf",
    name: "High Elf",
    nameRu: "Высший эльф",
    description:
      "Graceful and long-lived, high elves are masters of magic and combat.",
    modifiers: { i: 5, ag: 5, int: 5, fel: 5 },
    randomizeXp: 50,
    skills: ["language-aeltharin", "speak-additional-language"],
    talents: ["aethyric-attunement", "second-sight"],
    careers: ["any"],
    status: ["arcane-magic", "savant"],
  },
  {
    id: "wood-elf",
    name: "Wood Elf",
    nameRu: "Лесной эльф",
    description: "Cunning and swift, wood elves are at home in the forests.",
    modifiers: { ws: 5, ag: 5, i: 5 },
    randomizeXp: 60,
    skills: ["outdoor-survival", "set-traps"],
    talents: ["second-sight", "very-resilient"],
    careers: ["any"],
    status: ["savannah-dweller", "tracker"],
  },
  {
    id: "gnome",
    name: "Gnome",
    nameRu: "Гном",
    description: "Small and magical, gnomes are rare and mysterious.",
    modifiers: { int: 5, wp: 5, s: -5 },
    randomizeXp: 70,
    skills: ["language-gnomish", "magical-awareness"],
    talents: ["arcane-magic", "minimus-herbalist"],
    careers: ["any"],
    status: ["magical-sense", "tiny"],
  },
  {
    id: "ogre",
    name: "Ogre",
    nameRu: "Огр",
    description:
      "Massive and greedy, ogres are powerful mercenaries and hunters.",
    modifiers: { s: 10, t: 10, i: -5, ag: -5, int: -5 },
    randomizeXp: 40,
    skills: ["endurance", "intimidate"],
    talents: ["blood-of-the-mountain", "mongrel"],
    careers: ["any"],
    status: ["big-bones", "bull-neck"],
  },
];

export const getSpeciesById = (id: string): Species | undefined =>
  SPECIES.find((s) => s.id === id);
