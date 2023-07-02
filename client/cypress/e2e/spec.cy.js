describe('Coin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
  });
  it('Возможность авторизоваться', () => {
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
  });

  it('Возможность посмотреть список счетов', () => {
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
  cy.request({
    url: 'http://localhost:8080/accounts', 
      method: 'GET',
      headers: {
          'Authorization': `Basic ZGV2ZWxvcGVyOnNraWxsYm94`,
          'content-Type': 'application/json'
      }

  })
  .should((res) => {
    expect(res.status).to.eq(200)
  })
  });

  it('Возможность создать новый счет', () => {
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
    cy.url().should('include', '/accounts');
    cy.contains('Создать новый счёт').click();

  });

  it('Возможность перевести сумму со счета на счет', () => {
    cy.get('#login').type('developer');
    cy.get('#password').type('skillbox');
    cy.contains('Войти').click();
    cy.get('.card__btn ').then(btn => {
      cy.get(btn)
      .eq(0)
      .click()
       cy.get('.transfer__number').type('11101165882453067121863202');
    cy.get('.transfer__amount').type('100');
    cy.get('.transfer__btn').click();
    })

  });
})