// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');

// Customer Order class
class CustomerOrder {
    constructor(host = process.env.DB_HOST, port = process.env.DB_PORT, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB) {
        // Product array
        this.products = [];
        // Database connection variable
        this._connection = mysql.createConnection({
            host: host,
            port: port,
            user: user,
            password: password,
            database: database
        });
        // Connect to the database
        this._connection.connect(err => {
            if(err) throw err;
            console.log(`connected as id: ${this._connection.threadId}\n`)
        });
    }

    get connection() {
        return this._connection; //.config; //.host;
    }

    displayProducts() {
        this._connection.query('SELECT item_id, product_name, price FROM products', (err, res) => {
            if (err) throw err;
            console.log(res);
        });
    }

    disconnect() {
        console.log('\nThanks for Shopping with BAMazon!\n');
        this._connection.end();
    }

}



const newOrder = new CustomerOrder();
console.log(newOrder.connection.config.host);
newOrder.displayProducts();
newOrder.disconnect(); // need promise to delay this until after display completes

// newOrder.connection.connect(err => {
//     if(err) throw err;
//     console.log("connected as id " + newOrder.connection.threadId + "\n");
// })