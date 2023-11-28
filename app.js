const express = require('express');
const app = express();

//Permite capturar los datos de nuestro formulario media urlencoded
app.use(express.urlencoded({extended:false}))
app.use(express.json());

//Invocar o importar dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'})

//Directorio public
app.use('/', express.static('public'));
app.use('/', express.static(__dirname + '/public'));

//Establecer motor de plantillas ejs
app.set('view engine', 'ejs');

//Invocar bycrypjs
const bycrypjs = require('bcryptjs');

//Variables de sesion
const session = require('express-session');
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//Invocar el modulo de conexion de nuestra bd
const conection = require('./database/db')

/*app.get('/', (req, res)=>{
    res.send('Hello Word');
})*/

app.get('/', (req, res)=>{
    res.render('index');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

//register
app.post('/register', async(req, res)=>{
    const users = req.body.user;
    const name = req.body.name;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHash = await bycrypjs.hash(pass, 8)
    conection.query ('INSERT INTO users SET ?', {
        users:users, name:name, rol:rol, pass:passwordHash
    }, async(error, result)=>{
        if(error){
            console.log(error);
        }else{
            res.send('Succesful Registration')
        }
    })
})

app.post('/login', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;

    try {
        conection.query('SELECT * FROM users WHERE users = ?', [user], async (error, results) => {
            if (results.length > 0) {
                const passwordMatch = await bycrypjs.compare(pass, results[0].pass);
                if (passwordMatch) {
                    req.session.loggedin = true;
                    req.session.username = user;
                    res.redirect('/'); // Redirigir al index después del inicio de sesión exitoso
                } else {
                    res.redirect('/login'); // Redirigir de nuevo al formulario de inicio de sesión
                }
            } else {
                res.redirect('/login'); // Redirigir de nuevo al formulario de inicio de sesión
            }
        });
    } catch (error) {
        console.log(error);
        res.send('Error en el inicio de sesión');
    }
});



app.listen(3000, (req, res)=>{
    console.log('server running on https://localhost:3000/');
})