const express = require('express');
const hdsExpress = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv').config();
const hds = require('handlebars');

// Route import
const indexRoute = require('./routes/index');
const chatRoute = require('./routes/chat');

// Middleware
const isAuth = require('./middleware/isAuth');

// Express app
const app = express();

// Template engine. Default layout. x.hbs
// if_equals(x '===' y)
hds.registerHelper('if_equals', function (lvalue, operator, rvalue, options) {
  var operators, result;
  operators = {
      '===': function (l, r) { return l === r; },
  };
  result = operators[operator](lvalue, rvalue);
  if (result) {
      return options.fn(this);
  } else {
      return options.inverse(this);
  }

});

const settings = hdsExpress.create({
  defaultLayout: 'layout', 
  extname: 'hbs'
});

app.engine('hbs', settings.engine);
app.set('view engine', 'hbs');

// Static file js, css
app.use('/static', express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session and flash message
app.use(session({
  secret: process.env.SECRET_KEY,
  cookie: {
    maxAge: 60000
  },
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

// Route
app.use('/', indexRoute);
app.use('/chat', isAuth, chatRoute);

app.listen(process.env.PORT, () => 
  console.log(`http://localhost:${process.env.PORT}`));