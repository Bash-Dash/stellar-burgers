describe('Тестирование оформления заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: {
          email: 'test@example.com',
          name: 'Test User'
        }
      }
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space burger',
        order: { number: 12345 }
      }
    }).as('createOrder');

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
    cy.get('[data-testid="ingredient-bun"]').first().find('button').click();

    cy.get('[data-testid="ingredient-main"]').first().find('button').click();

    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-ingredient"]').should('exist');

    cy.get('[data-testid="order-button"]').click();

    cy.get('[data-testid="order-modal"]').should('be.visible');
    cy.get('[data-testid="order-number"]').should('contain.text', '12345');
  });
});
