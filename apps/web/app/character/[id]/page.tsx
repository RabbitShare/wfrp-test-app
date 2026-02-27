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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { getSkillValue } from "@/lib/services/character/calculations";
import {
  advanceCharacteristic,
  advanceSkill,
  advanceTalent,
  addXp,
} from "@/lib/services/character/advancement";
import { getSkillName, getTalentName } from "@/lib/services/helpers/lookup";
import {
  XP_COST_CHARACTERISTIC,
  XP_COST_SKILL,
  XP_COST_TALENT,
} from "@/lib/domain/constants";

export default function CharacterPage() {
  const params = useParams();
  const router = useRouter();
  const { characters, updateCharacter, deleteCharacter } = useCharacterStore();

  const [character, setCharacter] = useState<Character | null>(null);
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
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div>Персонаж не найден</div>
      </div>
    );
  }

  const species = SPECIES.find((s) => s.id === character.speciesId);
  const career = CAREERS.find((c) => c.id === character.careerId);

  const handleAddXp = () => {
    if (earnedXp > 0) {
      const result = addXp(character, earnedXp);
      updateCharacter(character.id, result.character as Character);
      setEarnedXp(0);
    }
  };

  const handleAdvanceCharacteristic = (key: CharacteristicKey) => {
    const result = advanceCharacteristic(character, key);
    if (result) {
      updateCharacter(character.id, result.character as Character);
    }
  };

  const handleAdvanceSkill = (skillId: string) => {
    const result = advanceSkill(character, skillId);
    if (result) {
      updateCharacter(character.id, result.character as Character);
    }
  };

  const handleAdvanceTalent = (talentId: string) => {
    const result = advanceTalent(character, talentId);
    if (result) {
      updateCharacter(character.id, result.character as Character);
    }
  };

  const deleteCharacterHandler = () => {
    if (confirm("Вы уверены, что хотите удалить этого персонажа?")) {
      deleteCharacter(character.id);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="text-primary hover:underline mb-2 inline-block text-sm sm:text-base"
            >
              ← Назад к списку
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              {character.name || "Безымянный персонаж"}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {species?.nameRu} • {career?.nameRu}
            </p>
          </div>
          <Button variant="destructive" onClick={deleteCharacterHandler}>
            Удалить
          </Button>
        </header>

        <Card className="mb-6">
          <CardContent className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
            <div className="flex flex-wrap gap-4 sm:gap-8">
              <div>
                <div className="text-sm text-muted-foreground">Опыт</div>
                <div className="text-2xl font-bold text-primary">
                  {character.xp}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">HP</div>
                <div className="text-2xl font-bold text-destructive">
                  {character.currentWounds}/{character.wounds}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Судьба</div>
                <div className="text-2xl font-bold">{character.fate}</div>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <Input
                type="number"
                value={earnedXp}
                onChange={(e) =>
                  setEarnedXp(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-16 sm:w-20 text-center"
                placeholder="XP"
              />
              <Button onClick={handleAddXp} className="flex-1 sm:flex-none">
                Добавить
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="stats" className="w-full flex flex-col">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="stats">Характеристики</TabsTrigger>
            <TabsTrigger value="skills">Навыки</TabsTrigger>
            <TabsTrigger value="talents">Таланты</TabsTrigger>
            <TabsTrigger value="advance">Развитие</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
                {CHARACTERISTIC_KEYS.map((key) => {
                  const char = CHARACTERISTICS.find((c) => c.key === key);
                  return (
                    <Card key={key} className="text-center p-3 sm:p-4">
                      <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                        {char?.shortName}
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary">
                        {character.characteristics[key]}
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="p-4">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-sm sm:text-base">
                    Параметры
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-3 gap-4 text-sm sm:text-base">
                    <div>
                      <div className="text-muted-foreground">
                        Ранения (TB+WPB+8)
                      </div>
                      <div className="text-xl font-bold">
                        {character.wounds}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Стойкость</div>
                      <div className="text-xl font-bold">
                        {character.resilience}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Решимость</div>
                      <div className="text-xl font-bold">
                        {character.resolve}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(character.status.tier !== "copper" ||
                character.status.level > 0) && (
                <Card className="p-4">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-sm sm:text-base">
                      Статус
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Badge variant="secondary" className="capitalize">
                      {character.status.tier} {character.status.level}
                    </Badge>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-3">
              <div className="grid gap-2">
                {character.skills.map((charSkill) => (
                  <Card
                    key={charSkill.id}
                    className="p-3 flex justify-between items-center"
                  >
                    <span className="text-sm sm:text-base">
                      {getSkillName(charSkill.id)}
                    </span>
                    <span className="text-primary font-bold text-sm sm:text-base">
                      {getSkillValue(character, charSkill.id)}% (
                      {charSkill.advances})
                    </span>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="talents">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {character.talents.map((charTalent) => (
                  <Badge key={charTalent.id} variant="secondary">
                    {getTalentName(charTalent.id)}
                  </Badge>
                ))}
                {character.talents.length === 0 && (
                  <div className="text-muted-foreground">Нет талантов</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advance">
            <div className="space-y-6">
              <Card className="p-4">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-primary text-sm sm:text-base">
                    Улучшение характеристик (стоимость: {XP_COST_CHARACTERISTIC}{" "}
                    XP)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-sm text-muted-foreground mb-3">
                    Доступно XP: {character.xp}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {CHARACTERISTIC_KEYS.map((key) => {
                      const char = CHARACTERISTICS.find((c) => c.key === key);
                      return (
                        <Button
                          key={key}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdvanceCharacteristic(key)}
                          disabled={character.xp < XP_COST_CHARACTERISTIC}
                          className="flex flex-col h-auto py-2"
                        >
                          <span>{char?.shortName}</span>
                          <span className="text-primary font-bold">+5</span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-primary text-sm sm:text-base">
                    Улучшение навыков (стоимость: {XP_COST_SKILL} XP)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {SKILLS.slice(0, 30).map((skill) => {
                      const charSkill = character.skills.find(
                        (s) => s.id === skill.id,
                      );
                      const hasSkill = !!charSkill;
                      return (
                        <Button
                          key={skill.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdvanceSkill(skill.id)}
                          disabled={character.xp < XP_COST_SKILL}
                          className="flex justify-between"
                        >
                          <span>{skill.nameRu || skill.name}</span>
                          <span className="text-primary">
                            {hasSkill
                              ? `+${(charSkill?.advances || 0) + 1}`
                              : "+1"}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-4">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-primary text-sm sm:text-base">
                    Получение талантов (стоимость: {XP_COST_TALENT} XP)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto">
                    {TALENTS.slice(0, 30).map((talent) => {
                      const hasTalent = character.talents.some(
                        (t) => t.id === talent.id,
                      );
                      return (
                        <Button
                          key={talent.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAdvanceTalent(talent.id)}
                          disabled={character.xp < XP_COST_TALENT || hasTalent}
                        >
                          {talent.nameRu || talent.name}
                          {hasTalent && (
                            <span className="text-green-500 ml-1">✓</span>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
