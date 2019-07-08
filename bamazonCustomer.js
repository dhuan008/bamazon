// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');

// Customer Order class
class CustomerOrder {
    constructor(host = process.env.DB_HOST, port = process.env.DB_PORT, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB) {
        this._connection = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
        this._connection.connect(err => {
            if(err) throw err;
            console.log(`connected as id: ${this._connection.threadId}\n`)
        })
    }

    get connection() {
        return this._connection; //.config; //.host;
    }
}



const newOrder = new CustomerOrder();
console.log(newOrder.connection.config.host);

// newOrder.connection.connect(err => {
//     if(err) throw err;
//     console.log("connected as id " + newOrder.connection.threadId + "\n");
// })