const express = require('express')
const path = require('path')
const db = require('./db')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const SECRET = 'chave-secreta';
const PORT = 3000;

app = express();


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'views', 'public')))

//Conseguir pegar os dados do back-end e enviar para o front-end
app.use((req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, SECRET);
      res.locals.user = req.user;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});


const routerIndex = require('./routes/routerIndex')
const routerAuth = require('./routes/routerAuth');
const routerNotes = require('./routes/routerNotes');

app.use(routerIndex)
app.use(routerAuth)
app.use(routerNotes)

app.listen(PORT, () =>{
    console.log("porta 127.0.0.1:3000")
});