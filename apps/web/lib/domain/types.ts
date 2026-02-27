import type {
  CharacteristicKey,
  CharacteristicValues,
} from "../wfrp/characteristics";

export type CharacterStatus = {
  tier: "copper" | "silver" | "gold";
  level: number;
};

export type CharacterSkill = {
  id: string;
  advances: number;
};

export type CharacterTalent = {
  id: string;
  advances: number;
};

export interface Character {
  id: string;
  name: string;
  speciesId: string;
  careerId: string;
  status: CharacterStatus;
  characteristics: CharacteristicValues;
  skills: CharacterSkill[];
  talents: CharacterTalent[];
  xp: number;
  spentXp: number;
  wounds: number;
  fate: number;
  fortune: number;
  extraPoints: number;
  resilience: number;
  resolve: number;
  currentWounds: number;
  motivation: string;
  age: number;
  height: string;
  hairColor: string;
  eyeColor: string;
  createdAt: string;
  updatedAt: string;
}

export type RollResult = {
  d1: number;
  d2: number;
  total: number;
  value: number;
};
