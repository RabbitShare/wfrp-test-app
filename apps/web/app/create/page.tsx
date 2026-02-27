"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCharacterStore } from "@/lib/store";
import { SPECIES } from "@/lib/wfrp/species";
import { CAREERS } from "@/lib/wfrp/careers";
import {
  CHARACTERISTICS,
  CHARACTERISTIC_KEYS,
  CharacteristicKey,
} from "@/lib/wfrp/characteristics";
import { Character } from "@/lib/wfrp/character";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import {
  getAvailableXp,
  getCareerSkills,
  getCareerTalents,
  assembleCharacter,
  rollAllCharacteristics,
} from "@/lib/services/character/creation";

type Step = "species" | "career" | "characteristics" | "skills" | "name";

const STEPS: { id: Step; label: string }[] = [
  { id: "species", label: "Раса" },
  { id: "career", label: "Профессия" },
  { id: "characteristics", label: "Характеристики" },
  { id: "skills", label: "Навыки" },
  { id: "name", label: "Имя" },
];

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
  const [tempCharacteristics, setTempCharacteristics] = useState<
    Record<CharacteristicKey, number>
  >({
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
    Record<
      CharacteristicKey,
      { d1: number; d2: number; total: number; value: number } | null
    >
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

  const handleRollCharacteristics = () => {
    const result = rollAllCharacteristics();
    setTempCharacteristics(result.characteristics);
    setRollResults(result.results);
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

    const updatedCharacter = assembleCharacter({
      baseCharacter: character,
      name,
      species: currentSpecies,
      career: currentCareer,
      characteristics: tempCharacteristics,
      characteristicsMethod,
    });

    updateCharacter(character.id, updatedCharacter);
    router.push(`/character/${character.id}`);
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
        Загрузка...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
            Создание персонажа
          </h1>
          <div className="flex flex-wrap gap-1 sm:gap-2 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-shrink-0">
                {i > 0 && <span className="text-muted-foreground mx-1">→</span>}
                <span
                  className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm whitespace-nowrap ${
                    step === s.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
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
            <p className="text-muted-foreground text-sm sm:text-base mb-3 sm:mb-4">
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
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold text-primary text-sm sm:text-base">
                    {species.nameRu}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {species.name}
                  </div>
                  {species.modifiers &&
                    Object.keys(species.modifiers).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1 sm:mt-2">
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
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-muted-foreground"
                  }`}
                >
                  <div className="font-semibold text-primary text-sm sm:text-base">
                    {career.nameRu}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {career.name}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
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
              <Button
                onClick={() => {
                  setCharacteristicsMethod("random");
                  handleRollCharacteristics();
                }}
                variant={
                  characteristicsMethod === "random" ? "default" : "outline"
                }
              >
                Бросить 2d10
              </Button>
              <Button
                onClick={() => setCharacteristicsMethod("choose")}
                variant={
                  characteristicsMethod === "choose" ? "default" : "outline"
                }
              >
                Выбрать (-100 XP)
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4">
              {CHARACTERISTIC_KEYS.map((key) => {
                const roll = rollResults[key];
                const char = CHARACTERISTICS.find((c) => c.key === key);
                return (
                  <Card key={key} className="p-2 sm:p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-xs sm:text-sm">
                        {char?.shortName}
                      </span>
                      {roll && (
                        <span className="text-xs text-muted-foreground">
                          [{roll.d1}+{roll.d2}={roll.total}]
                        </span>
                      )}
                    </div>
                    <div className="text-primary text-lg sm:text-xl font-bold">
                      {tempCharacteristics[key]}
                    </div>
                  </Card>
                );
              })}
            </div>

            {currentSpecies && (
              <Card className="p-3 sm:p-4 mt-3 sm:mt-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-sm sm:text-base">
                    С модификаторами расы:
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
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
                                ? "text-green-500"
                                : modifier < 0
                                  ? "text-destructive"
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
                </CardContent>
              </Card>
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
                <Card className="p-3 sm:p-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-primary text-sm sm:text-base">
                      Навыки профессии:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {getCareerSkills(currentCareer).map(
                        (skill) =>
                          skill && (
                            <span
                              key={skill.id}
                              className="px-2 py-1 bg-muted rounded text-xs sm:text-sm"
                            >
                              {skill.nameRu || skill.name}
                            </span>
                          ),
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-3 sm:p-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-primary text-sm sm:text-base">
                      Таланты профессии:
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {getCareerTalents(currentCareer).map((talent) =>
                        talent ? (
                          <span
                            key={talent.id}
                            className="px-2 py-1 bg-muted rounded text-xs sm:text-sm"
                          >
                            {talent.nameRu || talent.name}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            <div className="text-muted-foreground text-sm sm:text-base">
              Доступно XP:{" "}
              <span className="text-primary font-bold">
                {currentSpecies
                  ? getAvailableXp(currentSpecies, characteristicsMethod)
                  : 0}
              </span>
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Имя персонажа
            </h2>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите имя персонажа"
            />

            <Card className="p-3 sm:p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-sm sm:text-base">Итог:</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1 text-muted-foreground text-sm sm:text-base">
                  <p>Раса: {currentSpecies?.nameRu}</p>
                  <p>Профессия: {currentCareer?.nameRu}</p>
                  <p>
                    Доступно XP:{" "}
                    {currentSpecies
                      ? getAvailableXp(currentSpecies, characteristicsMethod)
                      : 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={step === "species"}
            className="w-full sm:w-auto"
          >
            Назад
          </Button>

          {step === "name" ? (
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Завершить
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="w-full sm:w-auto"
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
