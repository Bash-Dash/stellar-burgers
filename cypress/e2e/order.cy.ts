import {
  INGREDIENT_BUN_SELECTOR,
  INGREDIENT_MAIN_SELECTOR,
  CONSTRUCTOR_BUN_TOP_SELECTOR,
  CONSTRUCTOR_INGREDIENT_SELECTOR,
  ORDER_BUTTON_SELECTOR,
  ORDER_MODAL_SELECTOR,
  ORDER_NUMBER_SELECTOR,
  MODAL_CLOSE_SELECTOR,
  ADD_BUTTON_SELECTOR
} from '../support/constants';

describe('Тестирование оформления заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space burger',
        order: { number: 12345 }
      }
    }).as('createOrder');

    // Сохранение токенов
    cy.setCookie('accessToken', 'test-access-token');
    window.localStorage.setItem('refreshToken', 'test-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('Должен создавать заказ с булкой и начинкой', () => {
    // Добавляем булку и проверяем
    cy.get(INGREDIENT_BUN_SELECTOR).first().as('bun');
    cy.get('@bun').find(ADD_BUTTON_SELECTOR).click();
    cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('exist');

    // Добавляем начинку и проверяем
    cy.get(INGREDIENT_MAIN_SELECTOR).first().as('main');
    cy.get('@main').find(ADD_BUTTON_SELECTOR).click();
    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('exist');

    // Нажимаем кнопку заказа
    cy.get(ORDER_BUTTON_SELECTOR).click();

    // Ждем создания заказа
    cy.wait('@createOrder');

    // Проверяем модальное окно заказа
    cy.get(ORDER_MODAL_SELECTOR).should('be.visible');
    cy.get(ORDER_NUMBER_SELECTOR).should('contain.text', '12345');

    // Закрываем модальное окно
    cy.get(MODAL_CLOSE_SELECTOR).click();
    cy.get(ORDER_MODAL_SELECTOR).should('not.exist');

    // Проверяем что конструктор очистился
    cy.get(CONSTRUCTOR_BUN_TOP_SELECTOR).should('not.exist');
    cy.get(CONSTRUCTOR_INGREDIENT_SELECTOR).should('not.exist');
  });
});
