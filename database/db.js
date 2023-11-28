const mysql = require('mysql');

const conection = mysql.createConnection({
    host: process.eventNames.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

conection.connect((error) =>{
    if (error) {
        console.error('hubo un error' + error);
    } else {
        console.log('conexion exitosa')
    }
});

module.exports = conection;