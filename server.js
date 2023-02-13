const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5163

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function (req, res) {
    const ejsData = {

    }
    res.render('pages/index', ejsData)
  })
  .get('/health', function (req, res) {
   res.status(200).send('healthy')
  })
	.get('/about', function (req, res) {
		const ejsData = {

		}
		res.render('pages/about', ejsData)
	})
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
