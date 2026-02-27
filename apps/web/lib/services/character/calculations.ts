import type { Character, CharacterSkill } from "../../domain/types";
import type { CharacteristicKey } from "../../wfrp/characteristics";
import { SKILLS } from "../../wfrp/skills";

export const getSkillCharacteristic = (skillId: string): CharacteristicKey => {
  const skill = SKILLS.find((s) => s.id === skillId);
  return (skill?.characteristic as CharacteristicKey) || "int";
};

export const getSkillValue = (
  character: Character,
  skillId: string,
): number => {
  const charSkill = character.skills.find((s) => s.id === skillId);
  const advances = charSkill?.advances || 0;
  const characteristic = getSkillCharacteristic(skillId);
  const charValue = character.characteristics[characteristic] || 10;
  return Math.floor(charValue / 10) * 10 + advances * 5;
};

export const getTotalAdvances = (skills: CharacterSkill[]): number => {
  return skills.reduce((total, skill) => total + skill.advances, 0);
};
