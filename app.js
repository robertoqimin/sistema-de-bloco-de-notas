const express = require('express')
const path = require('path')
const PORT = 3000;
const db = require('./db')
const cookieParser = require('cookie-parser')

app = express();


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'views', 'public')))

const routerIndex = require('./routes/routerIndex')
const routerAuth = require('./routes/routerAuth');
const routerNotes = require('./routes/routerNotes');

app.use(routerIndex)
app.use(routerAuth)
app.use(routerNotes)



app.listen(PORT, () =>{
    console.log("porta 3000")
});