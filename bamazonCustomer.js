// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const { Table } = require('console-table-printer');

// Global Variable
let isShopping = true;

/**
 * Customer Order Class
 */
class CustomerOrder {
    constructor(host = process.env.DB_HOST, port = process.env.DB_PORT, user = process.env.DB_USER, password = process.env.DB_PASS, database = process.env.DB) {
        // Number of items in database, length
        this._numItems = 0;
        // Array of quanities
        this._amount = [];
        // Used to determine if the user should keep shopping
        this._isShopping = true;
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
            console.log(`connected as id: ${this._connection.threadId}\n`);
        });
    }

    /** 
     * @desc Getter for connection
     */
    get connection() {
        return this._connection; //.config; //.host;
    }

    /**
     * @desc Getter for boolean isShopping
     */
    get isShopping() {
        return this._isShopping;
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

                console.log(`Array of Quanities: ${this._amount}`);
                console.log(this._productTable.table.rows[0].text.Price);

                // Logs table to console
                resolve(this._productTable.printTable());
            });
        });
    }

    /**
     * @desc Asks user which item to buy and how many
     * Also does error checking if item exists or item is non zero
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
                // Calcuates total cost
                console.log(`Your total cost is ${amountResponse.quantity * (this._productTable.table.rows[idResponse.id - 1].text.Price).substring(1)}`);
                // Process order
                this.processOrder(idResponse.id, amountResponse.quantity);
            });
        });
    }

    /**
     * @desc Modifies database to reflect order
     * @param {*} id - id of the product to change
     * @param {*} amount - number of items to change by
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
                    err ? reject(err) : resolve(results); 
                });
        });
    }

    /**
     * Asks the user if they wish to keep shopping
     */
    keepShopping() {
        return inquirer.prompt([
            {
                type: 'list',
                message: 'Would you like to continue shopping?',
                choices: ['Yes', 'No'],
                name: 'choice'
            }
        ]).then(response => {
            response.choice === 'Yes' ? true : this._isShopping= false;
        })
    };

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

    // Continues shopping until user exits
    do {
        // Display items
        await newOrder.displayProducts();

        // Ask user for item to buy and amount
        await newOrder.promptUser();

        // Ask the user if they want to keep shopping
        await newOrder.keepShopping();

    } while (newOrder.isShopping);


    // console.log('awe', newOrder.numItems);
    newOrder.disconnect();
}

// main function call
main();
