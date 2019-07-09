// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const {Table} = require('console-table-printer');

/**
 * Customer Order Class
 */
class CustomerOrder {
    constructor(host = process.env.DB_HOST, port = process.env.DB_PORT, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB) {
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
            if (err) throw err;
            console.log(`connected as id: ${this._connection.threadId}\n`)
        });
    }

    /** 
     * @desc Getter for connection
     */
    get connection() {
        return this._connection; //.config; //.host;
    }

    /**
     * @desc Displays items from database ordered by id, item, price
     */
    displayProducts() {
        this._connection.query('SELECT item_id, product_name, price FROM products', (err, res) => {
            if (err) throw err;
            
            // Creates new table object to hold data to display
            const productTable = new Table({
                style: 'fatborder',
                columns: [
                    {name: 'ID', alignment: 'right'},
                    {name: 'Item', alignment: 'left'},
                    {name: 'Price', alignment: 'right'}
                ]
            });

            // Loops through results and adds relevant data to table for display
            for(let i = 0; i < res.length; i++) {
                productTable.addRow(
                    {
                        'ID': res[i].item_id,
                        'Item': res[i].product_name,
                        'Price': `$${res[i].price.toFixed(2)}`
                    }
                )
            }

            // Logs table to console
            productTable.printTable(productTable);
        });
    }

    /**
     * @desc Ends connection
     */
    disconnect() {
        this._connection.end();
        console.log('\nThanks for Shopping with BAMazon!\n');
    }

}



// const newOrder = new CustomerOrder();
// console.log(newOrder.connection.config.host);
// newOrder.displayProducts();
// newOrder.disconnect(); // need promise to delay this until after display completes


const main = () => {
    const newOrder = new CustomerOrder();
    newOrder.displayProducts();
    newOrder.disconnect();
}

main();
