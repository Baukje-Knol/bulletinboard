const express = require('express');
const ejs = require('ejs');
const app = express();
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const {
  Client
} = require('pg')

const sequelize = new Sequelize({
  user: process.env.BULLETINBOARD_USER,
  password: process.env.BULLETINBOARD_PASSWORD,
  database: process.env.BULLETINBOARD_DATABASE,
  host: process.env.BULLETINBOARD_HOST,
  port: process.env.BULLETINBOARD_PORT,
  dialect: 'postgres',
  define: {
    timestamps: false
  }

});

const Messages = sequelize.define('messages', {
  title: Sequelize.STRING,
  body: Sequelize.STRING
});

app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('../public'));


// Sequelize.connect();

//displaying posts
app.get('/', (req, res) => {
  Messages.findAll().then((data) => {
    res.render('home', {
      data: data
    })
  })
})

//adding posts
app.get('/addpost', (req, res) => {
  res.render('addpost', {})
})

app.post('/addpost', (req, res) => {

  let writ_title = req.body.title;
  let writ_body = req.body.body;
  Messages.create({
      title: `${writ_title}`,
      body: `${writ_body}`
    })
    .then(() => res.redirect('/'))
})
sequelize.sync()
const server = app.listen(3000, function() {
  console.log("port: " + server.address().port)
})
