/* eslint-disable cypress/unsafe-to-chain-command */
/* eslint-disable cypress/no-unnecessary-waiting */
describe('Тестирование меню', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })
  it('Создание категории', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/categories')
    cy.get('[data-test-id="btn-add-category"]').click()
    cy.get('[data-test-id="add-category-title"]').type('ААТестовая категория')
    cy.get('[data-test-id="btn-create-category"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая категория')
      .then(() => {
        cy.log('Категория создана')
      })
  })

  it('Обновление категории', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/categories')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая категория')
      .click()
    cy.get('[data-test-id="category-update-input"]').type('2')
    cy.get('[data-test-id="category-update-radio-true"]').click()
    cy.get('[data-test-id="category-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая категория2')
      .then(() => {
        cy.log('Категория обновлена')
      })
  })

  it('Создание группового модификатора', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/group-modifiers')
    cy.get('[data-test-id="group-modifiers-create-button"]').click()
    cy.get('[data-test-id="group-modifiers-create-input-title"]').type(
      'ААТестовый групповой модификатор'
    )
    cy.get('[data-test-id="group-modifiers-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый групповой модификатор')
      .then(() => {
        cy.log('Групповой модификатор создан')
      })
  })

  it('Создание модификатора', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/modifiers')
    cy.get('[data-test-id="modifiers-create-button"]').click()
    cy.get('[data-test-id="modifiers-create-input-title"]').type(
      'ААТестовый модификатор'
    )
    cy.get('[data-test-id="modifiers-create-input-price"]').type('999999')
    cy.get('[data-test-id="modifiers-create-input-weight"]').type('1500')
    cy.get('[data-test-id="modifiers-create-select"]')
      .click()
      .then(() => {
        cy.get(
          '[data-test-id="modifiers-create-select-ААТестовый групповой модификатор"]'
        ).click()
      })
    cy.get('[data-test-id="modifiers-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый модификатор')
      .then(() => {
        cy.log('Модификатор создан')
      })
  })

  it('Создание блюда', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/menu')
    cy.wait(1000)
    cy.get('[data-test-id="dish-create-button"]').click()
    cy.get('[data-test-id="dish-create-input-title"]').type('Тестовое блюдо')
    cy.get('[data-test-id="dish-create-input-price"]').type('9999999')
    cy.get('[data-test-id="dish-create-input-weight"]').type('150')
    cy.get('[data-test-id="dish-create-select"]').click()
    cy.get('[data-test-id="dish-create-select-ААТестовая категория2"]').click()
    cy.get('[data-test-id="dish-create-button"]').click()
    cy.log('Dish create successful')
    cy.get('table th:nth-child(3)').click().click().wait(1500)
    cy.get('table tbody tr:first-child td:nth-child(2) a')
      .should('contain', 'Тестовое блюдо')
      .then(() => {
        cy.log('Блюдо создано')
      })
  })

  it('Обновление блюда', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/menu')
    cy.get('table th:nth-child(3)').click().click().wait(1500)
    cy.get('table tbody tr:first-child td:nth-child(2) a')
      .should('contain', 'Тестовое блюдо')
      .click()
    cy.get('[data-test-id="dish-update-input-title"]').type('2')
    cy.get('[data-test-id="dish-update-input-price"]').type('9')
    cy.get('[data-test-id="dish-update-input-weight"]').type('5')
    cy.get(
      'body>div:nth-child(2)>div>section>section>main>div>div>label:nth-child(2)'
    ).click()
    cy.get('[data-test-id="modifiers-select"]')
      .click()
      .then(() => {
        cy.get(
          '[data-test-id="modifiers-select-ААТестовый модификатор"]'
        ).click()
      })
    cy.get('[data-test-id="modifiers-add-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый модификатор')
      .then(() => {
        cy.log('Модификатор добавлен в блюдо')
      })
    cy.get(
      'body>div:nth-child(2)>div>section>section>main>div>div>label:nth-child(3)'
    ).click()
    cy.get('[data-test-id="group-modifiers-select"]')
      .click()
      .then(() => {
        cy.get(
          '[data-test-id="group-modifiers-select-ААТестовый групповой модификатор"]'
        ).click()
      })
    cy.get('[data-test-id="group-modifiers-add-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый групповой модификатор')
      .then(() => {
        cy.log('Групповой модификатор добавлен в блюдо')
      })
    cy.get(
      'body>div:nth-child(2)>div>section>section>main>div>div>label:nth-child(1)'
    ).click()
    cy.get('[data-test-id="dish-update-button-save"]').click()
    cy.get('table th:nth-child(3)').click().click().wait(1500)
    cy.get('table tbody tr:first-child td:nth-child(2) a').should(
      'contain',
      'Тестовое блюдо2'
    )
    cy.get('table tbody tr:first-child td:nth-child(3)')
      .should('contain', '99999999')
      .then(() => {
        cy.log('Блюдо обновлено')
      })
  })

  it('Удаление блюда', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/menu')
    cy.get('table th:nth-child(3)').click().click().wait(1500)
    cy.get('table tbody tr:first-child td:nth-child(2) a')
      .should('contain', 'Тестовое блюдо2')
      .click()
    cy.scrollTo('bottom')
    cy.get('[data-test-id="dish-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:nth-child(3)').click().click().wait(1500)
    cy.get('table tbody tr:first-child td:nth-child(2) a')
      .should('not.contain', 'Тестовое блюдо2')
      .then(() => {
        cy.log('Блюдо удалено')
      })
  })

  it('Удаление модификатора', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/modifiers')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a').should(
      'contain',
      'ААТестовый модификатор'
    )
    cy.get('table tbody tr:first-child td:nth-child(5)')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(4)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовый модификатор')
      .then(() => {
        cy.log('Модификатор удален')
      })
  })

  it('Удаление группового модификатора', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/group-modifiers')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a').should(
      'contain',
      'ААТестовый групповой модификатор'
    )
    cy.get('table tbody tr:first-child td:nth-child(5)')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(4)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовый групповой модификатор')
      .then(() => {
        cy.log('Групповый модификатор удален')
      })
  })

  it('Удаление категории', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/categories')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a').should(
      'contain',
      'ААТестовая категория2'
    )
    cy.get('table tbody tr:first-child td:nth-child(5)')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(4)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовая категория2')
      .then(() => {
        cy.log('Категория удалена')
      })
  })
})

describe('Тестирование видов оплат', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })

  it('Создание оплаты', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/payments')
    cy.wait(1000)
    cy.get('[data-test-id="payment-create-button"]').click()
    cy.get('[data-test-id="payment-create-input-title"]').type(
      'ААТестовая оплата'
    )
    cy.get('[data-test-id="payment-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая оплата')
      .then(() => {
        cy.log('Оплата создана')
      })
  })
  it('Обновление оплаты', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/payments')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая оплата')
      .click()
    cy.get('[data-test-id="payment-update-input-title"]').type('2')
    cy.get('[data-test-id="payment-update-select"]').click()
    cy.get('[data-test-id="payment-update-checkbox-false"]').click()
    cy.get('[data-test-id="payment-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая оплата2')
      .then(() => {
        cy.log('Кнопка обновлена')
      })
  })
  it('Удаление оплаты', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/payments')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая оплата2')
      .click()
    cy.get('[data-test-id="payment-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовая оплата2')
      .then(() => {
        cy.log('Оплата удалена')
      })
  })
})

describe('Тестирование типов заказов', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })

  it('Создание типа заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-types')
    cy.wait(1500)
    cy.get('[data-test-id="order-types-create-button"]').click()
    cy.get('[data-test-id="order-types-create-input-title"]').type(
      'ААТестовый тип заказов'
    )
    cy.get('[data-test-id="order-types-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый тип заказов')
      .then(() => {
        cy.log('Тип заказов создан')
      })
  })
  it('Обновление типа заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-types')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый тип заказов')
      .click()
    cy.get('[data-test-id="order-types-update-input-title"]').type('2')
    cy.get('[data-test-id="order-types-update-select"]').click()
    cy.get('[data-test-id="order-types-update-select-false"]').click()
    cy.get('[data-test-id="order-types-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый тип заказов2')
      .then(() => {
        cy.log('Тип заказов обновлен')
      })
  })
  it('Удаление типа заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-types')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый тип заказов2')
      .click()
    cy.get('[data-test-id="order-types-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовый тип заказов2')
      .then(() => {
        cy.log('Тип заказов удален')
      })
  })
})

describe('Тестирование статусов заказов', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })

  it('Создание статуса заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-statuses')
    cy.wait(1500)
    cy.get('[data-test-id="order-status-create-button"]').click()
    cy.get('[data-test-id="order-status-create-input-title"]').type(
      'ААТестовый статус заказов'
    )
    cy.get('[data-test-id="order-status-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый статус заказов')
      .then(() => {
        cy.log('Статус заказов создан')
      })
  })
  it('Обновление статуса заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-statuses')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый статус заказов')
      .click()
    cy.get('[data-test-id="order-status-update-input-title"]').type('2')
    cy.get('[data-test-id="order-status-update-select"]').click()
    cy.get('[data-test-id="order-status-update-select-false"]').click()
    cy.get('[data-test-id="order-status-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый статус заказов2')
      .then(() => {
        cy.log('Статус заказов обновлен')
      })
  })
  it('Удаление статуса заказов', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/order-statuses')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовый статус заказов2')
      .click()
    cy.get('[data-test-id="order-status-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовый статус заказов2')
      .then(() => {
        cy.log('Статус заказов удален')
      })
  })
})

describe('Тестирование кнопок', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })

  it('Создание кнопки', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/buttons')
    cy.wait(1000)
    cy.get('[data-test-id="button-create-button"]').click()
    cy.get('[data-test-id="button-create-input"]').type('ААТестовая кнопка')
    cy.get('[data-test-id="button-create-save"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая кнопка')
      .then(() => {
        cy.log('Кнопка создана')
      })
  })

  it('Обновление кнопки', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/buttons')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая кнопка')
      .click()
    cy.get('[data-test-id="button-update-input"]').type('2')
    cy.get('[data-test-id="button-update-select"]').click()
    cy.get('[data-test-id="button-update-checkbox-false"]').click()
    cy.get('[data-test-id="button-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая кнопка2')
      .then(() => {
        cy.log('Кнопка обновлена')
      })
  })

  it('Удаление кнопки', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/buttons')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовая кнопка2')
      .click()
    cy.get('[data-test-id="button-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовая кнопка2')
      .then(() => {
        cy.log('Кнопка удалена')
      })
  })
})

describe('Тестирование полей в форме', () => {
  beforeEach(() => {
    cy.visit('/admin/autorization')
    cy.get('[data-test-id="login"]').type(Cypress.env('login'))
    cy.get('[data-test-id="password"]').type(Cypress.env('password'))
    cy.get('[data-test-id="btn-login"]').click()
    cy.log('Login successful')
  })

  it('Создание поля в форме', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/custom-inputs')
    cy.wait(1000)
    cy.get('[data-test-id="custom-inputs-create-button"]').click()
    cy.get('[data-test-id="custom-inputs-create-input-title"]').type(
      'ААТестовое поле'
    )
    cy.get('[data-test-id="custom-inputs-create-input-placeholder"]').type(
      'ААТестовое поле'
    )
    cy.get('[data-test-id="custom-inputs-create-input-label"]').type(
      'ААТестовое поле'
    )
    cy.get('[data-test-id="custom-inputs-create-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовое поле')
      .then(() => {
        cy.log('Поле в форме создано')
      })
  })

  it('Обновление поля в форме', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/custom-inputs')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовое поле')
      .click()
    cy.get('[data-test-id="custom-inputs-update-input-title"]').type('2')
    cy.get('[data-test-id="custom-inputs-update-input-placeholder"]').type('2')
    cy.get('[data-test-id="custom-inputs-update-input-label"]').type('2')
    cy.get('[data-test-id="custom-inputs-update-checkbox"]').click()
    cy.get('[data-test-id="custom-inputs-update-button"]').click()
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовое поле2')
      .then(() => {
        cy.log('Поле в форме обновлено')
      })
  })

  it('Удаление поля в форме', () => {
    cy.get('[data-test-id="btn-login"]').click()
    cy.wait(1000)
    cy.visit('/admin/custom-inputs')
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('contain', 'ААТестовое поле2')
      .click()
    cy.get('[data-test-id="custom-inputs-delete-button"]')
      .click()
      .then(() => {
        cy.get(
          'body>div:nth-child(3)>div>div>div>div>div>div:nth-child(2)>button:nth-child(2)'
        ).click()
      })
    cy.get('table th:first-child').click()
    cy.get('table tbody tr:first-child td:first-child a')
      .should('not.contain', 'ААТестовое поле2')
      .then(() => {
        cy.log('Поле в форме удалено')
      })
  })
})
