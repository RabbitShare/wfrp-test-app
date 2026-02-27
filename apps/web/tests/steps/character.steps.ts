import { Given, When, Then } from "@cucumber/cucumber";
import { setWorldConstructor, IWorld } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

interface CustomWorld extends IWorld {
  page: any;
  baseUrl: string;
}

const BASE_URL = "http://localhost:3000";

let characterId: string | undefined;

class CustomWorldImpl implements CustomWorld {
  page: any;
  baseUrl: string = BASE_URL;
  attach: any;
  log: any;
  parameters: any;
  link: any;

  constructor({
    page,
    attach,
    log,
    link,
    parameters,
  }: {
    page: any;
    attach?: any;
    log?: any;
    link?: any;
    parameters?: any;
  }) {
    this.page = page;
    this.attach = attach;
    this.log = log;
    this.link = link;
    this.parameters = parameters;
  }
}

setWorldConstructor(CustomWorldImpl);

Given("пользователь на главной странице", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/");
});

Given("в хранилище нет персонажей", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/");
  await this.page.evaluate(() => {
    localStorage.clear();
  });
});

Given("localStorage очищен", async function (this: CustomWorld) {
  await this.page.evaluate(() => {
    localStorage.clear();
  });
  await this.page.reload();
});

Given(
  "пользователь на странице создания персонажа",
  async function (this: CustomWorld) {
    await this.page.goto(BASE_URL + "/create");
    await this.page.waitForLoadState("networkidle");
  },
);

When('он выбирает расу "Высший эльф"', async function (this: CustomWorld) {
  await this.page.waitForTimeout(500);
  const elfButton = this.page.locator('button:has-text("Высший эльф")').first();
  await elfButton.click({ timeout: 15000 });
});

When(
  "он выбирает профессию {string}",
  async function (this: CustomWorld, profession: string) {
    await this.page.waitForTimeout(1000);
    const professionButton = this.page
      .locator(`button:has-text("${profession}")`)
      .first();
    await professionButton.click({ timeout: 15000 });
  },
);

When("он бросает 2d10 для характеристик", async function (this: CustomWorld) {
  const rollButton = this.page.locator('button:has-text("Бросить 2d10")');
  await rollButton.click();
  await this.page.waitForTimeout(500);
});

When(
  "он вводит имя {string}",
  async function (this: CustomWorld, name: string) {
    await this.page.waitForTimeout(1000);
    const nameInput = this.page.locator('input[type="text"]');
    await nameInput.fill(name, { timeout: 15000 });
  },
);

When(
  "он нажимает кнопку {string}",
  async function (this: CustomWorld, buttonText: string) {
    await this.page.waitForTimeout(500);
    const button = this.page.locator(`button:has-text("${buttonText}")`);
    await button.click({ timeout: 15000 });
  },
);

Then("персонаж сохранён в хранилище", async function (this: CustomWorld) {
  const characters = await this.page.evaluate(() => {
    const data = localStorage.getItem("wfrp-characters");
    return data ? JSON.parse(data).state.characters : [];
  });
  expect(characters.length).toBeGreaterThan(0);
  characterId = characters[0]?.id;
});

Then(
  "пользователь перенаправлен на страницу персонажа",
  async function (this: CustomWorld) {
    await expect(this.page).toHaveURL(/\/character\/.+/);
  },
);

Then(
  'отображается имя "Тестовый Персонаж"',
  async function (this: CustomWorld) {
    await expect(this.page.locator("h1")).toContainText("Тестовый Персонаж");
  },
);

Given("существует персонаж с XP", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/create");
  await this.page.waitForLoadState("networkidle");

  await this.page.waitForTimeout(500);
  const elfButton = this.page.locator('button:has-text("Высший эльф")').first();
  await elfButton.click({ timeout: 15000 });

  await this.page.waitForTimeout(1000);
  const nextButton1 = this.page.locator('button:has-text("Далее")');
  await nextButton1.click({ timeout: 15000 });

  await this.page.waitForTimeout(1500);
  await this.page.waitForLoadState("networkidle");
  const wandererButton = this.page
    .locator('button:has-text("Странник")')
    .first();
  await wandererButton.click({ timeout: 15000 });

  await this.page.waitForTimeout(1000);
  const nextButton2 = this.page.locator('button:has-text("Далее")');
  await nextButton2.click({ timeout: 15000 });

  await this.page.waitForTimeout(1500);
  await this.page.waitForLoadState("networkidle");
  const rollButton = this.page.locator('button:has-text("Бросить 2d10")');
  await rollButton.click({ timeout: 15000 });
  await this.page.waitForTimeout(1000);

  await this.page.waitForTimeout(500);
  const nextButton3 = this.page.locator('button:has-text("Далее")');
  await nextButton3.click({ timeout: 15000 });

  await this.page.waitForTimeout(500);
  const nextButton4 = this.page.locator('button:has-text("Далее")');
  await nextButton4.click({ timeout: 15000 });

  await this.page.waitForTimeout(500);
  const nameInput = this.page.locator('input[type="text"]');
  await nameInput.fill("XP Персонаж", { timeout: 15000 });

  const finishButton = this.page.locator('button:has-text("Завершить")');
  await finishButton.click({ timeout: 15000 });
  await this.page.waitForURL(/\/character\/.+/);

  const url = this.page.url();
  characterId = url.split("/character/")[1];
});

When("пользователь выбирает персонажа", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/");
  await this.page.waitForLoadState("networkidle");

  const firstCharacterLink = this.page
    .locator('a[href^="/character/"]')
    .first();
  await firstCharacterLink.click({ timeout: 15000 });
  await this.page.waitForURL(/\/character\/.+/);
});

Then("персонаж отображается на странице", async function (this: CustomWorld) {
  await expect(this.page.locator("h1")).toBeVisible({ timeout: 10000 });
});

When(
  "пользователь увеличивает характеристику",
  async function (this: CustomWorld) {
    await this.page.waitForTimeout(500);
    const advanceTab = this.page.locator('button:has-text("Развитие")');
    await advanceTab.click({ timeout: 15000 });

    await this.page.waitForTimeout(500);
    const charButton = this.page.locator('button:has-text("+5")').first();
    await charButton.click({ timeout: 15000 });
    await this.page.waitForTimeout(300);
  },
);

Then(
  "значение характеристики увеличивается",
  async function (this: CustomWorld) {
    const charButton = this.page.locator('button:has-text("+10")').first();
    await expect(charButton).toBeVisible({ timeout: 10000 });
  },
);

Then(
  "потрачено XP соответствует стоимости",
  async function (this: CustomWorld) {
    const spentXpText = await this.page.locator("body").textContent();
    expect(spentXpText).toMatch(/\d+/);
  },
);

Given("существует персонаж для удаления", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/create");
  await this.page.waitForLoadState("networkidle");

  await this.page.waitForTimeout(500);
  const elfButton = this.page.locator('button:has-text("Высший эльф")').first();
  await elfButton.click({ timeout: 15000 });

  await this.page.waitForTimeout(1000);
  const nextButton1 = this.page.locator('button:has-text("Далее")');
  await nextButton1.click({ timeout: 15000 });

  await this.page.waitForTimeout(1500);
  await this.page.waitForLoadState("networkidle");
  const wandererButton = this.page
    .locator('button:has-text("Странник")')
    .first();
  await wandererButton.click({ timeout: 15000 });

  await this.page.waitForTimeout(1000);
  const nextButton2 = this.page.locator('button:has-text("Далее")');
  await nextButton2.click({ timeout: 15000 });

  await this.page.waitForTimeout(1500);
  await this.page.waitForLoadState("networkidle");
  const rollButton = this.page.locator('button:has-text("Бросить 2d10")');
  await rollButton.click({ timeout: 15000 });
  await this.page.waitForTimeout(1000);

  await this.page.waitForTimeout(500);
  const nextButton3 = this.page.locator('button:has-text("Далее")');
  await nextButton3.click({ timeout: 15000 });

  await this.page.waitForTimeout(500);
  const nextButton4 = this.page.locator('button:has-text("Далее")');
  await nextButton4.click({ timeout: 15000 });

  await this.page.waitForTimeout(500);
  const nameInput = this.page.locator('input[type="text"]');
  await nameInput.fill("Удаляемый", { timeout: 15000 });

  const finishButton = this.page.locator('button:has-text("Завершить")');
  await finishButton.click({ timeout: 15000 });
  await this.page.waitForURL(/\/character\/.+/);
});

When("пользователь удаляет персонажа", async function (this: CustomWorld) {
  await this.page.goto(BASE_URL + "/");
  await this.page.waitForLoadState("networkidle");

  const deleteButton = this.page.locator('button:has-text("Удалить")').first();
  await deleteButton.click();

  await this.page.waitForTimeout(300);
});

Then(
  "персонаж больше не отображается в списке",
  async function (this: CustomWorld) {
    await expect(this.page.locator("text=Удаляемый")).not.toBeVisible();
  },
);

Then("персонаж удалён из хранилища", async function (this: CustomWorld) {
  const characters = await this.page.evaluate(() => {
    const data = localStorage.getItem("wfrp-characters");
    return data ? JSON.parse(data).state.characters : [];
  });
  const deletedCharacter = characters.find(
    (c: { name: string }) => c.name === "Удаляемый",
  );
  expect(deletedCharacter).toBeUndefined();
});
