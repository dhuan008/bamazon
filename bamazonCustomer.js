// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const { Table } = require('console-table-printer');

/**
 * Customer Order Class
 */
class CustomerOrder {
    constructor(host = process.env.DB_HOST, port = process.env.DB_PORT, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB) {
        // Number of items in database, length
        this._numItems = 0;
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
     * @desc Getter for length
     */
    get numItems() {
        return this._numItems;
    }

    /**
     * @desc Displays items from databaseint a table ordered by id, item, price
     */
    displayProducts() {
        return new Promise((resolve, reject) => {
            this._connection.query('SELECT item_id, product_name, price FROM products', (err, res) => {
                if (err) reject(err);

                // Set length
                this._numItems = res.length;
                //console.log(this._numItems);

                // Creates new table object to hold data to display
                const productTable = new Table({
                    style: 'fatborder',
                    columns: [
                        { name: 'ID', alignment: 'right' },
                        { name: 'Item', alignment: 'left' },
                        { name: 'Price', alignment: 'right' }
                    ]
                });

                // Loops through results and adds relevant data to table for display
                for (let i = 0; i < this._numItems; i++) {
                    productTable.addRow(
                        {
                            'ID': res[i].item_id,
                            'Item': res[i].product_name,
                            'Price': `$${res[i].price.toFixed(2)}`
                        }
                    )
                }

                // Logs table to console
                resolve(productTable.printTable());
            });
        });
    }

    /**
     * @desc Ends connection
     */
    disconnect() {
        this._connection.end();
        console.log('\nThank you for Shopping with BAMazon!\n');
    }

}



// const newOrder = new CustomerOrder();
// console.log(newOrder.connection.config.host);
// newOrder.displayProducts();
// newOrder.disconnect(); // need promise to delay this until after display completes


/**
 * Main
 */
const main = async () => {

    // Creates a new order
    const newOrder = new CustomerOrder();
    await newOrder.displayProducts();



    // console.log('awe', newOrder.numItems);
    newOrder.disconnect();
}

// main function call
main();
