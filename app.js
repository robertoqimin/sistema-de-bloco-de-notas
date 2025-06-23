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

// Middleware para verificar token
function verifyToken(req, res, next) {
    // Tenta obter o token do header, query ou cookie
    const auth = req.headers.authorization || req.query.token || (req.cookies && req.cookies.token);
    let token;
    if (auth && auth.startsWith && auth.startsWith('Bearer ')) {
        token = auth.split(' ')[1];
    } else if (typeof auth === 'string') {
        token = auth;
    }
    // Se não encontrou, tenta pegar do cookie
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) return res.status(403).send('Não logado');
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch {
        res.status(403).send('Token inválido');
    }
}



app.listen(PORT, () =>{
    console.log("porta 127.0.0.1:3000")
});