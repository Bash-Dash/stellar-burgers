import {
  INGREDIENT_BUN_SELECTOR,
  INGREDIENT_MAIN_SELECTOR,
  INGREDIENT_SAUCE_SELECTOR,
  CONSTRUCTOR_BUN_TOP_SELECTOR,
  CONSTRUCTOR_BUN_BOTTOM_SELECTOR,
  CONSTRUCTOR_INGREDIENT_SELECTOR,
  ADD_BUTTON_SELECTOR
} from '../support/constants';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен добавлять булку в конструктор и проверять конкретный ингредиент', () => {
    cy.get(INGREDIENT_BUN_SELECTOR).first().as('bun');

    // Получаем данные булки
    cy.get('@bun').within(() => {
      cy.get('[class*="text_type_main"]').invoke('text').as('bunName');
      cy.get('[class*="digits-default"]').invoke('text').as('bunPrice');
    });

    // Добавляем булку
    cy.get('@bun').find('button').click();

    // Проверяем что булка добавилась
    cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('exist');
    cy.get(CONSTRUCTOR_BUN_BOTTOM_SELECTOR).should('exist');

    // Проверяем что добавилась именно та булка
    cy.get('@bunName').then((name) => {
      cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('contain.text', name);
    });
  });

  it('Должен добавлять начинку в конструктор и проверять конкретный ингредиент', () => {
    cy.get(INGREDIENT_MAIN_SELECTOR).first().as('main');

    // Получаем данные начинки
    cy.get('@main').within(() => {
      cy.get('[class*="text_type_main"]').invoke('text').as('mainName');
      cy.get('[class*="digits-default"]').invoke('text').as('mainPrice');
    });

    // Добавляем начинку
    cy.get('@main').find(ADD_BUTTON_SELECTOR).click();

    // Проверяем что начинка добавилась
    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('exist');

    // Проверяем что добавилась именно та начинка
    cy.get('@mainName').then((name) => {
      cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('contain.text', name);
    });

    cy.get('@mainPrice').then((price) => {
      cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('contain.text', price);
    });
  });

  it('Должен добавлять соус в конструктор и проверять конкретный ингредиент', () => {
    cy.get(INGREDIENT_SAUCE_SELECTOR).first().as('sauce');

    // Получаем данные соуса
    cy.get('@sauce').within(() => {
      cy.get('[class*="text_type_main"]').invoke('text').as('sauceName');
    });

    // Добавляем соус
    cy.get('@sauce').find(ADD_BUTTON_SELECTOR).click();

    // Проверяем что соус добавился
    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('exist');

    // Проверяем что добавился именно тот соус
    cy.get('@sauceName').then((name) => {
      cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('contain.text', name);
    });
  });
});
