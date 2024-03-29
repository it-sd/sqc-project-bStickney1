const { queryAllVideos, generateRandomString } =
  require('../../server.js')

describe('video server', function () {
  const baseUrl = 'http://localhost:5163'
  const shouldBeAbove200 = async function (route) {
    it('should be above 200', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeGreaterThanOrEqual(200)
    }, 10000)
  }
  const shouldBeLessThan399 = async function (route) {
    it('should be below 399', async function () {
      const url = new URL(route, baseUrl)
      const res = await fetch(url)
      expect(res.status).toBeLessThanOrEqual(399)
    }, 10000)
  }
  describe("GET '/health'", function () {
    shouldBeAbove200('/health')
  })
  describe("GET '/'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/about'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/search'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/account'", function () {
    shouldBeAbove200('/')
  })
  describe("GET '/health'", function () {
    shouldBeLessThan399('/health')
  })
  describe("GET '/'", function () {
    shouldBeLessThan399('/')
  })

  describe('queryAllVideos', function () {
    it('should return 1 video', async function () {
      const results = await queryAllVideos()
      expect(results).toBeDefined()
      expect(results.videos).toBeDefined()
      expect(results.videos.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('generateRandomString', function () {
    it('should return a string', function () {
      const result = generateRandomString(10)
      expect(typeof result).toBe('string')
    })
  })

  describe("POST '/search'", function () {
    const url = new URL('/search', baseUrl)

    it('should accept a search value', async function () {
      const searchBox = 'test search'

      const data = {
        searchBox: searchBox.value
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeTrue()
    })

    it('should not accept an empty search value', async function () {
      const data = {
        searchBox: ''
      }
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      expect(response.ok).toBeFalse()
    })
  })
})
