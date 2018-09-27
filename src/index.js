const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg')

const client = new Client({
  user: process.env.BULLETINBOARD_USER,
  password: process.env.BULLETINBOARD_PASSWORD,
  database: process.env.BULLETINBOARD_DATABASE,
  host: process.env.BULLETINBOARD_HOST,
  port: process.env.BULLETINBOARD_PORT
})

app.use(bodyParser.urlencoded({
  extended:false
}))

app.set('views', 'views');
app.set('view engine', 'ejs');

app.use(express.static('../public'));


client.connect();

//displaying posts
app.get('/', (req,res) =>{

client.query(`select * from messages`, (err, result) => {
  console.log(err ? err.stack : 'showing messages')
  let data = result.rows
  res.render('home', {
    data:data
  })
})
})

//adding posts
app.get('/addpost', (req,res) =>{
  res.render('addpost',{
  })
})

app.post('/addpost', (req,res) =>{

  let writ_title = req.body.title;
  let writ_body = req.body.body;
  console.log(req.body)
  client.query(`insert into messages (title, body) values ('${writ_title}','${writ_body}')`, (err) => {
    console.log(err ? err.stack : 'messages inserted')
    res.redirect('/')
  })

})


const server = app.listen(3000, function() {
  console.log("port: " + server.address().port);
})
