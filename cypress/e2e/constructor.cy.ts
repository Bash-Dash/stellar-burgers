describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Должен добавлять булку в конструктор', () => {
    cy.get('[data-testid="ingredient-bun"]').first().find('button').click();
    cy.get('[data-testid="constructor-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
  });

  it('Должен добавлять начинку в конструктор', () => {
    cy.get('[data-testid="ingredient-main"]').first().find('button').click();
    cy.get('[data-testid="constructor-ingredient"]').should('exist');
  });

  it('Должен добавлять соус в конструктор', () => {
    cy.get('[data-testid="ingredient-sauce"]').first().find('button').click();
    cy.get('[data-testid="constructor-ingredient"]').should('exist');
  });
});
