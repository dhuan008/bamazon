// Dependencies
require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const { Table } = require('console-table-printer');

// // Global Functions
// /**
//  * @desc
//  * @param {*} promise 
//  * @author Jason Kaiser(creator?), Jesse Warden(blog)
//  * @website http://jessewarden.com/2017/11/easier-error-handling-using-asyncawait.html
//  */
// const sureThing = promise => {
//     promise
//     .then(data => ({ok: true, data}))
//     .catch(error => Promise.resolve({ok: false, error}));
// };


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
                        }
                    )
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
                    if (value > 0 && value <= this._numItems) { // needs to check for zero quanity else if 
                        return true;
                    }
                    else {
                        return `Please choose a number between 1 and ${this._numItems}`;
                    }
                },
                name: 'id'
            }
        ]).then(idResponse => {
            console.log(idResponse.id);
            return inquirer.prompt([
                {
                    type: 'number',
                    message: 'Please enter quanity to buy: ',
                    validate: value => {
                        if (value > 0 && value <= this._amount[idResponse.id]) {
                            return true;
                        }
                        else {
                            return `Please choose a number between 0 and ${this._amount[idResponse.id]}`;
                        }
                    },
                    name: 'quantity'
                }
            ]).then(amountResponse => {
                console.log(amountResponse.quantity);
                this.checkOrder(idResponse.id-1, amountResponse.quantity);
            });
        });
    }

    /**
     * @desc Check order
     * @param {*} id 
     * @param {*} amount 
     */
    checkOrder(id, amount) {
        // console.log(id);
        // console.log(this._amount[id]);
        if(this._amount[id] >= amount) {
            console.log('ok');
        }
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

    await newOrder.promptUser();

    // console.log('awe', newOrder.numItems);
    newOrder.disconnect();
}

// main function call
main();
