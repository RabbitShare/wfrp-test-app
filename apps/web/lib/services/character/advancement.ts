import type { Character } from "../../domain/types";
import type { CharacteristicKey } from "../../wfrp/characteristics";
import {
  XP_COST_CHARACTERISTIC,
  XP_COST_SKILL,
  XP_COST_TALENT,
} from "../../domain/constants";

export interface AdvancementResult {
  character: Partial<Character>;
}

export const advanceCharacteristic = (
  character: Character,
  key: CharacteristicKey,
): AdvancementResult | null => {
  if (character.xp < XP_COST_CHARACTERISTIC) {
    return null;
  }

  return {
    character: {
      characteristics: {
        ...character.characteristics,
        [key]: character.characteristics[key] + 5,
      },
      xp: character.xp - XP_COST_CHARACTERISTIC,
      spentXp: character.spentXp + XP_COST_CHARACTERISTIC,
    },
  };
};

export const advanceSkill = (
  character: Character,
  skillId: string,
): AdvancementResult | null => {
  if (character.xp < XP_COST_SKILL) {
    return null;
  }

  const existingSkill = character.skills.find((s) => s.id === skillId);
  const newSkills = existingSkill
    ? character.skills.map((s) =>
        s.id === skillId ? { ...s, advances: s.advances + 1 } : s,
      )
    : [...character.skills, { id: skillId, advances: 1 }];

  return {
    character: {
      skills: newSkills,
      xp: character.xp - XP_COST_SKILL,
      spentXp: character.spentXp + XP_COST_SKILL,
    },
  };
};

export const advanceTalent = (
  character: Character,
  talentId: string,
): AdvancementResult | null => {
  if (character.xp < XP_COST_TALENT) {
    return null;
  }

  const existingTalent = character.talents.find((t) => t.id === talentId);
  if (existingTalent) {
    return null;
  }

  return {
    character: {
      talents: [...character.talents, { id: talentId, advances: 1 }],
      xp: character.xp - XP_COST_TALENT,
      spentXp: character.spentXp + XP_COST_TALENT,
    },
  };
};

export const addXp = (
  character: Character,
  xpToAdd: number,
): AdvancementResult => {
  return {
    character: {
      xp: character.xp + xpToAdd,
    },
  };
};
