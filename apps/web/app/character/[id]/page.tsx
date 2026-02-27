"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCharacterStore } from "@/lib/store";
import { SPECIES } from "@/lib/wfrp/species";
import { CAREERS } from "@/lib/wfrp/careers";
import { SKILLS } from "@/lib/wfrp/skills";
import { TALENTS } from "@/lib/wfrp/talents";
import {
  CHARACTERISTICS,
  CHARACTERISTIC_KEYS,
  CharacteristicKey,
} from "@/lib/wfrp/characteristics";
import { Character } from "@/lib/wfrp/character";
import { Button } from "@workspace/ui/components/button";

const XP_COST_CHARACTERISTIC = 100;
const XP_COST_SKILL = 100;
const XP_COST_TALENT = 200;

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const { characters, updateCharacter, deleteCharacter } = useCharacterStore();

  const [character, setCharacter] = useState<Character | null>(null);
  const [activeTab, setActiveTab] = useState<
    "stats" | "skills" | "talents" | "advance"
  >("stats");
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    const id = params.id as string;
    const char = characters.find((c) => c.id === id);
    if (char) {
      setCharacter(char);
    }
  }, [params.id, characters]);

  if (!character) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 p-4 flex items-center justify-center">
        <div>Персонаж не найден</div>
      </div>
    );
  }

  const species = SPECIES.find((s) => s.id === character.speciesId);
  const career = CAREERS.find((c) => c.id === character.careerId);

  const getSkillName = (id: string) => {
    const skill = SKILLS.find((s) => s.id === id);
    return skill?.nameRu || skill?.name || id;
  };

  const getTalentName = (id: string) => {
    const talent = TALENTS.find((t) => t.id === id);
    return talent?.nameRu || talent?.name || id;
  };

  const getSkillCharacteristic = (skillId: string) => {
    const skill = SKILLS.find((s) => s.id === skillId);
    return skill?.characteristic || "int";
  };

  const getSkillValue = (skillId: string) => {
    const charSkill = character.skills.find((s) => s.id === skillId);
    const advances = charSkill?.advances || 0;
    const char = getSkillCharacteristic(skillId);
    const charValue =
      character.characteristics[char as CharacteristicKey] || 10;
    return Math.floor(charValue / 10) * 10 + advances * 5;
  };

  const handleAddXp = () => {
    if (earnedXp > 0) {
      updateCharacter(character.id, {
        xp: character.xp + earnedXp,
      });
      setEarnedXp(0);
    }
  };

  const advanceCharacteristic = (key: CharacteristicKey) => {
    if (character.xp >= XP_COST_CHARACTERISTIC) {
      updateCharacter(character.id, {
        characteristics: {
          ...character.characteristics,
          [key]: character.characteristics[key] + 5,
        },
        xp: character.xp - XP_COST_CHARACTERISTIC,
        spentXp: character.spentXp + XP_COST_CHARACTERISTIC,
      });
    }
  };

  const advanceSkill = (skillId: string) => {
    if (character.xp >= XP_COST_SKILL) {
      const existingSkill = character.skills.find((s) => s.id === skillId);
      const newSkills = existingSkill
        ? character.skills.map((s) =>
            s.id === skillId ? { ...s, advances: s.advances + 1 } : s,
          )
        : [...character.skills, { id: skillId, advances: 1 }];

      updateCharacter(character.id, {
        skills: newSkills,
        xp: character.xp - XP_COST_SKILL,
        spentXp: character.spentXp + XP_COST_SKILL,
      });
    }
  };

  const advanceTalent = (talentId: string) => {
    if (character.xp >= XP_COST_TALENT) {
      const existingTalent = character.talents.find((t) => t.id === talentId);
      if (existingTalent) return;

      updateCharacter(character.id, {
        talents: [...character.talents, { id: talentId, advances: 1 }],
        xp: character.xp - XP_COST_TALENT,
        spentXp: character.spentXp + XP_COST_TALENT,
      });
    }
  };

  const deleteCharacterHandler = () => {
    if (confirm("Вы уверены, что хотите удалить этого персонажа?")) {
      deleteCharacter(character.id);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="text-amber-500 hover:underline mb-2 inline-block text-sm sm:text-base"
            >
              ← Назад к списку
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-amber-400">
              {character.name || "Безымянный персонаж"}
            </h1>
            <p className="text-stone-400 text-sm sm:text-base">
              {species?.nameRu} • {career?.nameRu}
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={deleteCharacterHandler}
            className="bg-red-900/50 hover:bg-red-900 text-sm sm:text-base"
          >
            Удалить
          </Button>
        </header>

        <div className="bg-stone-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div>
                <div className="text-sm text-stone-400">Опыт</div>
                <div className="text-2xl font-bold text-amber-400">
                  {character.xp}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-400">HP</div>
                <div className="text-2xl font-bold text-red-400">
                  {character.currentWounds}/{character.wounds}
                </div>
              </div>
              <div>
                <div className="text-sm text-stone-400">Судьба</div>
                <div className="text-2xl font-bold">{character.fate}</div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="number"
                value={earnedXp}
                onChange={(e) =>
                  setEarnedXp(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-16 sm:w-20 p-2 bg-stone-700 border border-stone-600 rounded text-center text-base"
                placeholder="XP"
              />
              <Button
                onClick={handleAddXp}
                className="bg-amber-600 hover:bg-amber-700 flex-1 sm:flex-none text-sm sm:text-base"
              >
                Добавить
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {(["stats", "skills", "talents", "advance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-2 rounded text-sm ${
                activeTab === tab
                  ? "bg-amber-600 text-white"
                  : "bg-stone-800 text-stone-400 hover:bg-stone-700"
              }`}
            >
              {tab === "stats" && "Характеристики"}
              {tab === "skills" && "Навыки"}
              {tab === "talents" && "Таланты"}
              {tab === "advance" && "Развитие"}
            </button>
          ))}
        </div>

        {activeTab === "stats" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
              {CHARACTERISTIC_KEYS.map((key) => {
                const char = CHARACTERISTICS.find((c) => c.key === key);
                return (
                  <div
                    key={key}
                    className="bg-stone-800 p-3 sm:p-4 rounded text-center"
                  >
                    <div className="text-xs sm:text-sm text-stone-400 mb-1">
                      {char?.shortName}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                      {character.characteristics[key]}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-semibold mb-3 text-sm sm:text-base">
                Параметры
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm sm:text-base">
                <div>
                  <div className="text-stone-400">Ранения (TB+WPB+8)</div>
                  <div className="text-xl font-bold">{character.wounds}</div>
                </div>
                <div>
                  <div className="text-stone-400">Стойкость</div>
                  <div className="text-xl font-bold">
                    {character.resilience}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400">Решимость</div>
                  <div className="text-xl font-bold">{character.resolve}</div>
                </div>
              </div>
            </div>

            {character.status.length > 0 && (
              <div className="bg-stone-800 p-4 rounded">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Статусы
                </h3>
                <div className="flex flex-wrap gap-2">
                  {character.status.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-1 bg-amber-900/30 rounded text-sm"
                    >
                      {s.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "skills" && (
          <div className="space-y-3">
            <div className="grid gap-2">
              {character.skills.map((charSkill) => (
                <div
                  key={charSkill.id}
                  className="bg-stone-800 p-3 rounded flex justify-between items-center"
                >
                  <span className="text-sm sm:text-base">
                    {getSkillName(charSkill.id)}
                  </span>
                  <span className="text-amber-400 font-bold text-sm sm:text-base">
                    {getSkillValue(charSkill.id)}% ({charSkill.advances})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "talents" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {character.talents.map((charTalent) => (
                <div
                  key={charTalent.id}
                  className="bg-stone-800 px-3 py-2 rounded text-sm sm:text-base"
                >
                  {getTalentName(charTalent.id)}
                </div>
              ))}
              {character.talents.length === 0 && (
                <div className="text-stone-400">Нет талантов</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "advance" && (
          <div className="space-y-6">
            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-semibold text-amber-400 mb-3 text-sm sm:text-base">
                Улучшение характеристик (стоимость: {XP_COST_CHARACTERISTIC} XP)
              </h3>
              <p className="text-sm text-stone-400 mb-3">
                Доступно XP: {character.xp}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CHARACTERISTIC_KEYS.map((key) => {
                  const char = CHARACTERISTICS.find((c) => c.key === key);
                  return (
                    <button
                      key={key}
                      onClick={() => advanceCharacteristic(key)}
                      disabled={character.xp < XP_COST_CHARACTERISTIC}
                      className="bg-stone-700 p-2 rounded hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      <div>{char?.shortName}</div>
                      <div className="text-amber-400 font-bold">+5</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-semibold text-amber-400 mb-3 text-sm sm:text-base">
                Улучшение навыков (стоимость: {XP_COST_SKILL} XP)
              </h3>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {SKILLS.slice(0, 30).map((skill) => {
                  const charSkill = character.skills.find(
                    (s) => s.id === skill.id,
                  );
                  const hasSkill = !!charSkill;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => advanceSkill(skill.id)}
                      disabled={character.xp < XP_COST_SKILL}
                      className="bg-stone-700 p-2 rounded hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed flex justify-between text-xs sm:text-sm"
                    >
                      <span>{skill.nameRu || skill.name}</span>
                      <span className="text-amber-400">
                        {hasSkill ? `+${(charSkill?.advances || 0) + 1}` : "+1"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-stone-800 p-4 rounded">
              <h3 className="font-semibold text-amber-400 mb-3 text-sm sm:text-base">
                Получение талантов (стоимость: {XP_COST_TALENT} XP)
              </h3>
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                {TALENTS.slice(0, 30).map((talent) => {
                  const hasTalent = character.talents.some(
                    (t) => t.id === talent.id,
                  );
                  return (
                    <button
                      key={talent.id}
                      onClick={() => advanceTalent(talent.id)}
                      disabled={character.xp < XP_COST_TALENT || hasTalent}
                      className="bg-stone-700 px-3 py-2 rounded hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                    >
                      {talent.nameRu || talent.name}
                      {hasTalent && (
                        <span className="text-green-400 ml-1">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
