var createError = require('http-errors');
var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var { graphql, buildSchema } = require('graphql');

var cors = require('cors');
app.use(cors());


let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/user',(err)=>{
  if(!err){
    console.log('Database Connected');
  }
})



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// var mongoose = require('mongoose');
var session = require('express-session');


var passport = require('passport');
let auth = require('./routes/auth')(passport);
// mongoose.connect('mongodb://localhost:27017/login').then(() => console.log('Database Connected'))
//   .catch((err) => console.error(err));


require('./passport')(passport);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'thesecret',
  saveUninitialized: false,
  resave: false
}))

  
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type ,Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();

});



app.use('/',indexRouter);
app.use('/users', usersRouter);
app.use('/auth', auth);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

var root = { hello: () => 'Hello world!' };

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});

module.exports = app;
