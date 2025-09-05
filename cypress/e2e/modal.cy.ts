import {
  INGREDIENT_SELECTOR,
  MODAL_SELECTOR,
  MODAL_CLOSE_SELECTOR,
  MODAL_OVERLAY_SELECTOR,
  INGREDIENT_DETAILS_TEXT
} from '../support/constants';

describe('Тестирование модальных окон', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    window.localStorage.setItem('accessToken', 'test-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Должно открываться модальное окно с деталями ингредиента', () => {
    cy.get(INGREDIENT_SELECTOR).first().as('ingredient');

    // Получаем данные ингредиента
    cy.get('@ingredient').within(() => {
      cy.get('img').invoke('attr', 'src').as('ingredientImage');
      cy.get('[class*="text_type_main"]').invoke('text').as('ingredientName');
      cy.get('[class*="digits-default"]').invoke('text').as('ingredientPrice');
    });

    // Кликаем на ингредиент
    cy.get('@ingredient').click();

    // Проверяем что модальное окно открылось
    cy.get(MODAL_SELECTOR).should('be.visible');

    // Проверяем что данные совпадают
    cy.get('@ingredientName').then((name) => {
      cy.get(MODAL_SELECTOR).should('contain.text', name);
    });
  });

  it('Должно закрываться модальное окно по крестику', () => {
    cy.get(INGREDIENT_SELECTOR).first().click();
    cy.get(MODAL_SELECTOR).should('be.visible');

    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.get(MODAL_SELECTOR).should('not.exist');
  });

  it('Должно закрываться модальное окно по оверлею', () => {
    cy.get(INGREDIENT_SELECTOR).first().click();
    cy.get(MODAL_SELECTOR).should('be.visible');

    cy.get(MODAL_OVERLAY_SELECTOR).click({ force: true });
    cy.get(MODAL_SELECTOR).should('not.exist');
  });
});
