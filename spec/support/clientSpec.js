const { Builder, By } = require('selenium-webdriver')

describe('client', function () {
  describe('account', function () {
    const baseUrl = 'http://localhost:5163/account'
    let driver

    beforeEach(async function () {
      driver = await new Builder().forBrowser('firefox').build()
      await driver.get(baseUrl)
    })

    afterEach(async function () {
      await driver.quit()
    })

    // TODO: Make tests
  })
})
