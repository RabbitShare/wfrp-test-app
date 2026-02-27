"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "@/lib/store";
import { SPECIES } from "@/lib/wfrp/species";
import { CAREERS } from "@/lib/wfrp/careers";
import { SKILLS } from "@/lib/wfrp/skills";
import { TALENTS } from "@/lib/wfrp/talents";
import {
  CHARACTERISTICS,
  CHARACTERISTIC_KEYS,
  CharacteristicKey,
  CharacteristicValues,
  roll2d10,
  getCharacteristicValue,
} from "@/lib/wfrp/characteristics";
import {
  calculateWounds,
  calculateResilience,
  calculateResolve,
  Character,
  getStatusFromCareer,
} from "@/lib/wfrp/character";
import { Button } from "@workspace/ui/components/button";

type Step = "species" | "career" | "characteristics" | "skills" | "name";

const STEPS: { id: Step; label: string }[] = [
  { id: "species", label: "Раса" },
  { id: "career", label: "Профессия" },
  { id: "characteristics", label: "Характеристики" },
  { id: "skills", label: "Навыки" },
  { id: "name", label: "Имя" },
];

type RollResult = {
  d1: number;
  d2: number;
  total: number;
  value: number;
};

export default function CreateCharacterPage() {
  const router = useRouter();
  const { characters, currentCharacterId, updateCharacter, addCharacter } =
    useCharacterStore();

  const [step, setStep] = useState<Step>("species");
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("");
  const [characteristicsMethod, setCharacteristicsMethod] = useState<
    "random" | "choose"
  >("random");
  const [tempCharacteristics, setTempCharacteristics] =
    useState<CharacteristicValues>({
      ws: 20,
      bs: 20,
      s: 20,
      t: 20,
      i: 20,
      ag: 20,
      dex: 20,
      int: 20,
      wp: 20,
      fel: 20,
    });
  const [rollResults, setRollResults] = useState<
    Record<CharacteristicKey, RollResult | null>
  >({
    ws: null,
    bs: null,
    s: null,
    t: null,
    i: null,
    ag: null,
    dex: null,
    int: null,
    wp: null,
    fel: null,
  });
  const [name, setName] = useState("");

  useEffect(() => {
    if (!currentCharacterId) {
      const newChar = addCharacter();
      setCharacter(newChar);
    } else {
      const existing = characters.find((c) => c.id === currentCharacterId);
      if (existing) {
        setCharacter(existing);
        setSelectedSpeciesId(existing.speciesId);
        setSelectedCareerId(existing.careerId);
        setName(existing.name);
        setTempCharacteristics(existing.characteristics);
      }
    }
  }, []);

  const currentSpecies = SPECIES.find((s) => s.id === selectedSpeciesId);
  const currentCareer = CAREERS.find((c) => c.id === selectedCareerId);

  const rollAllCharacteristics = () => {
    const rolled: CharacteristicValues = {} as CharacteristicValues;
    const results: Record<CharacteristicKey, RollResult | null> = {} as Record<
      CharacteristicKey,
      RollResult | null
    >;

    CHARACTERISTIC_KEYS.forEach((key) => {
      const d1 = Math.floor(Math.random() * 10) + 1;
      const d2 = Math.floor(Math.random() * 10) + 1;
      const total = d1 + d2;
      const value = getCharacteristicValue(total);
      rolled[key] = value;
      results[key] = { d1, d2, total, value };
    });

    setTempCharacteristics(rolled);
    setRollResults(results);
  };

  const applySpeciesModifiers = () => {
    if (!currentSpecies) return tempCharacteristics;
    const modified = { ...tempCharacteristics };
    Object.entries(currentSpecies.modifiers).forEach(([key, value]) => {
      if (value) {
        modified[key as CharacteristicKey] += value;
      }
    });
    return modified;
  };

  const getAvailableXp = () => {
    if (!currentSpecies) return 0;
    let xp = currentSpecies.randomizeXp;
    if (characteristicsMethod === "choose") {
      xp -= 100;
    }
    return Math.max(0, xp) + (character?.xp || 0);
  };

  const getCareerSkills = () => {
    if (!currentCareer) return [];
    return currentCareer.skills
      .map((id) => SKILLS.find((s) => s.id === id))
      .filter(Boolean);
  };

  const getCareerTalents = () => {
    if (!currentCareer) return [];
    return currentCareer.talents
      .map((id) => TALENTS.find((t) => t.id === id))
      .filter(Boolean);
  };

  const handleNext = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === step);
    if (currentIndex < STEPS.length - 1) {
      setStep(STEPS[currentIndex + 1]!.id);
    }
  };

  const handleBack = () => {
    const currentIndex = STEPS.findIndex((s) => s.id === step);
    if (currentIndex > 0) {
      setStep(STEPS[currentIndex - 1]!.id);
    }
  };

  const handleSave = () => {
    if (!character || !currentSpecies || !currentCareer) return;

    const finalCharacteristics = applySpeciesModifiers();
    const wounds = calculateWounds(finalCharacteristics);
    const resilience = calculateResilience(finalCharacteristics);
    const resolve = calculateResolve(finalCharacteristics);

    const updatedCharacter: Character = {
      ...character,
      name: name || "Безымянный",
      speciesId: selectedSpeciesId,
      careerId: selectedCareerId,
      characteristics: finalCharacteristics,
      skills: getCareerSkills().map((s) => ({ id: s!.id, advances: 0 })),
      talents: getCareerTalents().map((t) => ({ id: t!.id, advances: 0 })),
      status: getStatusFromCareer(currentCareer?.status || "None"),
      xp: getAvailableXp(),
      spentXp: 0,
      wounds,
      currentWounds: wounds,
      resilience,
      resolve,
    };

    updateCharacter(character.id, updatedCharacter);
    router.push(`/character/${character.id}`);
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 p-4 sm:p-6">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-amber-500 mb-4">
            Создание персонажа
          </h1>
          <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                {i > 0 && <span className="text-stone-600 mx-1">→</span>}
                <span
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
                    step === s.id
                      ? "bg-amber-600 text-white"
                      : "bg-stone-800 text-stone-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {step === "species" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Выберите расу
            </h2>
            <p className="text-stone-400 text-sm sm:text-base mb-3 sm:mb-4">
              При броске вы получите {currentSpecies?.randomizeXp || 0} XP
              бонуса
            </p>
            <div className="grid gap-2 sm:gap-3">
              {SPECIES.map((species) => (
                <button
                  key={species.id}
                  onClick={() => setSelectedSpeciesId(species.id)}
                  className={`p-3 sm:p-4 rounded-lg border text-left transition-colors ${
                    selectedSpeciesId === species.id
                      ? "border-amber-500 bg-amber-900/20"
                      : "border-stone-700 bg-stone-800 hover:border-stone-600"
                  }`}
                >
                  <div className="font-semibold text-amber-400 text-sm sm:text-base">
                    {species.nameRu}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-400">
                    {species.name}
                  </div>
                  {species.modifiers &&
                    Object.keys(species.modifiers).length > 0 && (
                      <div className="text-xs text-stone-500 mt-1 sm:mt-2">
                        Модификаторы:{" "}
                        {Object.entries(species.modifiers)
                          .map(([k, v]) => {
                            const char = CHARACTERISTICS.find(
                              (c) => c.key === k,
                            );
                            return `${char?.shortName || k}${v && v > 0 ? "+" : ""}${v}`;
                          })
                          .join(", ")}
                      </div>
                    )}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "career" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Выберите профессию
            </h2>
            <div className="grid gap-2 sm:gap-3 max-h-[60vh] overflow-y-auto">
              {CAREERS.map((career) => (
                <button
                  key={career.id}
                  onClick={() => setSelectedCareerId(career.id)}
                  className={`p-3 sm:p-4 rounded-lg border text-left transition-colors ${
                    selectedCareerId === career.id
                      ? "border-amber-500 bg-amber-900/20"
                      : "border-stone-700 bg-stone-800 hover:border-stone-600"
                  }`}
                >
                  <div className="font-semibold text-amber-400 text-sm sm:text-base">
                    {career.nameRu}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-400">
                    {career.name}
                  </div>
                  <div className="text-xs sm:text-sm text-stone-500">
                    {career.classRu || career.class}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "characteristics" && (
          <div className="space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Характеристики
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
              <button
                onClick={() => {
                  setCharacteristicsMethod("random");
                  rollAllCharacteristics();
                }}
                className={`px-3 sm:px-4 py-2 rounded text-sm ${
                  characteristicsMethod === "random"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-800 text-stone-400"
                }`}
              >
                Бросить 2d10
              </button>
              <button
                onClick={() => setCharacteristicsMethod("choose")}
                className={`px-3 sm:px-4 py-2 rounded text-sm ${
                  characteristicsMethod === "choose"
                    ? "bg-amber-600 text-white"
                    : "bg-stone-800 text-stone-400"
                }`}
              >
                Выбрать (-100 XP)
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
              {CHARACTERISTIC_KEYS.map((key) => {
                const roll = rollResults[key];
                const char = CHARACTERISTICS.find((c) => c.key === key);
                return (
                  <div key={key} className="bg-stone-800 p-2 sm:p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs sm:text-sm">
                        {char?.shortName}
                      </span>
                      {roll && (
                        <span className="text-xs text-stone-500">
                          [{roll.d1}+{roll.d2}={roll.total}]
                        </span>
                      )}
                    </div>
                    <div className="text-amber-400 text-lg sm:text-xl font-bold">
                      {tempCharacteristics[key]}
                    </div>
                  </div>
                );
              })}
            </div>

            {currentSpecies && (
              <div className="bg-stone-800 p-3 sm:p-4 rounded mt-3 sm:mt-4">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  С модификаторами расы:
                </h3>
                <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm">
                  {CHARACTERISTIC_KEYS.map((key) => {
                    const modifier = currentSpecies.modifiers[key] || 0;
                    const total = tempCharacteristics[key] + modifier;
                    const char = CHARACTERISTICS.find((c) => c.key === key);
                    return (
                      <div key={key} className="flex justify-between">
                        <span>{char?.shortName}:</span>
                        <span
                          className={
                            modifier > 0
                              ? "text-green-400"
                              : modifier < 0
                                ? "text-red-400"
                                : ""
                          }
                        >
                          {total}{" "}
                          {modifier !== 0 &&
                            `(${modifier > 0 ? "+" : ""}${modifier})`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {step === "skills" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Навыки и таланты
            </h2>

            {currentCareer && (
              <>
                <div className="bg-stone-800 p-3 sm:p-4 rounded">
                  <h3 className="font-semibold text-amber-400 mb-2 text-sm sm:text-base">
                    Навыки профессии:
                  </h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {currentCareer.skills.map((skillId) => {
                      const skill = SKILLS.find((s) => s.id === skillId);
                      return skill ? (
                        <span
                          key={skill.id}
                          className="px-2 py-1 bg-stone-700 rounded text-xs sm:text-sm"
                        >
                          {skill.nameRu || skill.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="bg-stone-800 p-3 sm:p-4 rounded">
                  <h3 className="font-semibold text-amber-400 mb-2 text-sm sm:text-base">
                    Таланты профессии:
                  </h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {currentCareer.talents.map((talentId) => {
                      const talent = TALENTS.find((t) => t.id === talentId);
                      return talent ? (
                        <span
                          key={talent.id}
                          className="px-2 py-1 bg-stone-700 rounded text-xs sm:text-sm"
                        >
                          {talent.nameRu || talent.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="text-stone-400 text-sm sm:text-base">
              Доступно XP:{" "}
              <span className="text-amber-400 font-bold">
                {getAvailableXp()}
              </span>
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Имя персонажа
            </h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя персонажа"
              className="w-full p-3 bg-stone-800 border border-stone-700 rounded text-stone-100 placeholder:text-stone-500 text-base"
            />

            <div className="bg-stone-800 p-3 sm:p-4 rounded">
              <h3 className="font-semibold mb-2 text-sm sm:text-base">Итог:</h3>
              <div className="space-y-1 text-stone-300 text-sm sm:text-base">
                <p>Раса: {currentSpecies?.nameRu}</p>
                <p>Профессия: {currentCareer?.nameRu}</p>
                <p>Доступно XP: {getAvailableXp()}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={step === "species"}
            className="border-stone-600 w-full sm:w-auto"
          >
            Назад
          </Button>

          {step === "name" ? (
            <Button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
            >
              Завершить
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
              disabled={
                (step === "species" && !selectedSpeciesId) ||
                (step === "career" && !selectedCareerId)
              }
            >
              Далее
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
