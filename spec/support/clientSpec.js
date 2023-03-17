const { Builder, By } = require('selenium-webdriver')

describe('client', function () {
  describe('search', function () {
    const baseUrl = 'http://localhost:5163/search'
    let driver

    beforeEach(async function () {
      driver = await new Builder().forBrowser('firefox').build()
      await driver.get(baseUrl)
    })

    afterEach(async function () {
      await driver.quit()
    })

    it('should have a search box', async function () {
      const details = await driver.findElement(By.css('#searchBox'))
      expect(details).toBeDefined()
    })

    it('should have a search box', async function () {
      const details = await driver.findElement(By.css('#searchBox'))
      expect(details).toBeDefined()
    })
  })

  describe('index', function () {
    const baseUrl = 'http://localhost:5163/'
    let driver

    beforeEach(async function () {
      driver = await new Builder().forBrowser('firefox').build()
      await driver.get(baseUrl)
    })

    afterEach(async function () {
      await driver.quit()
    })

    it('should have like button', async function () {
      const details = await driver.findElement(By.id('likeButton'))
      await details.click()
      const like = await driver.findElement(By.id('likeButton'))
      expect(like).toBeDefined()
    })

    it('should have a dislike button', async function () {
      const details = await driver.findElement(By.id('dislikeButton'))
      await details.click()
      const dislike = await driver.findElement(By.id('dislikeButton'))
      expect(dislike).toBeDefined()
    })
  })
})
