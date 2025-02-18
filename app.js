const express = require('express')
const path = require('path')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')

// eslint-disable-next-line no-unused-vars
const db = require('./models')
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))

app.use(routes)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
