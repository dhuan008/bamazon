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
        // Array of quanities
        this._amount = [];
        // Table to store products to print from database
        this._productTable;
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
     * @desc Displays items from database in a table
     */
    displayProducts() {
        return new Promise((resolve, reject) => {
            this._connection.query('SELECT item_id, product_name, price, stock_quantity FROM products', (err, res) => {
                if (err) reject(err);

                // Set length
                this._numItems = res.length;
                //console.log(this._numItems);

                // Creates new table object to hold data to display
                this._productTable = new Table({
                    style: 'fatborder',
                    columns: [
                        { name: 'ID', alignment: 'right' },
                        { name: 'Item', alignment: 'left' },
                        { name: 'Price', alignment: 'right' }
                    ]
                });

                // Loops through results and adds relevant data to table for display
                for (let i = 0; i < this._numItems; i++) {
                    this._productTable.addRow(
                        {
                            'ID': res[i].item_id,
                            'Item': res[i].product_name,
                            'Price': `$${res[i].price.toFixed(2)}`
                            //'Quantity': res[i].stock_quantity
                        }
                    )
                    // Array with quanity for each item
                    this._amount[i] = res[i].stock_quantity;
                }

                console.log(this._amount);
                //console.log(this._productTable.table.rows[0].text);

                // Logs table to console
                resolve(this._productTable.printTable());
            });
        });
    }

    /**
     * @desc Asks user
     */
    promptUser() {
        return inquirer.prompt([
            {
                type: 'number',
                message: 'Please enter the ID of the item you wish to buy: ',
                validate: value => {
                    if (value > 0 && value <= this._numItems) {
                        return true;
                    }
                    else {
                        return `Please choose a number between 1 and ${this._numItems}`;
                    }
                },
                name: 'id'
            }
        ]).then(idResponse => {
            // Check if items remaining
            if (this._amount[idResponse.id - 1] <= 0) {
                return console.log('Sorry, out of stock');
            }
            return inquirer.prompt([
                {
                    type: 'number',
                    message: 'Please enter quanity to buy: ',
                    validate: value => {
                        if (value > 0 && value <= this._amount[idResponse.id - 1]) {
                            return true;
                        }
                        else {
                            return `Please choose a number between 0 and ${this._amount[idResponse.id - 1]}`;
                        }
                    },
                    name: 'quantity'
                }
            ]).then(amountResponse => {
                console.log(amountResponse.quantity);
                this.processOrder(idResponse.id, amountResponse.quantity);
            });
        });
    }

    /**
     * @desc Process order
     * @param {*} id 
     * @param {*} amount 
     */
    processOrder(id, amount) {
        return new Promise((resolve, reject) => {
            this._connection.query('UPDATE products SET ? WHERE ?',
                [
                    {
                        stock_quantity: this._amount[id - 1] - amount
                    },
                    {
                        item_id: id
                    }
                ], (err, results) => {
                    if (err) reject(err);
                    resolve(results);
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


/**
 * Main
 */
const main = async () => {

    // Creates a new order
    const newOrder = new CustomerOrder();

    do {
        // Display items
        await newOrder.displayProducts();

        // Ask user for item to buy and amount
        await newOrder.promptUser();
    } while ();


    // console.log('awe', newOrder.numItems);
    newOrder.disconnect();
}

// main function call
main();
