const mysql = require('mysql2');
require('dotenv').config(); // Nạp biến môi trường từ .env

const dbConfig = {
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,           
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME     
};

const connection = mysql.createConnection(dbConfig);

module.exports = connection;