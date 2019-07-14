# Bamazon

This is a command line application that allows mimics a online storefront by taking orders from customers, calculating a total price, and adjusting stock in inventory.

### Prerequisties
- Node.js and a package manager installed to a terminal
- MySQL required for database

### Dependencies
- Use yarn or your preferred package manager to install dependencies

Ex.
``
yarn install
``
``
npm install
``

## Running the App
- A database is required for storing product information for this app.
    1. Start MySQL server
    2. Run the queries found in the bamazon.sql file to create the bamazon database and tables
- Set up environmental variables for your database. Use the ex.env file as a reference
- In your terminal, run node on bamazonCustomer.js to start the app

Ex.
``
node bamazonCustomer.js
``

### Demo/Examples: 

A console log showing current stock is shown in this demo. It is removed in the actual application. Below are common use cases

![Demo1](https://github.com/dhuan008/bamazon/blob/master/demo/1Order.gif)
- Demonatrating how to make a standard order

![Demo2](https://github.com/dhuan008/bamazon/blob/master/demo/2QuantityCheck.gif)
- Checking Quantity of item selected

![Demo3](https://github.com/dhuan008/bamazon/blob/master/demo/3ProductCheck.gif)
- Checking if item selected is available


## Technologies Used
- Node.js
- NPM
- MySQL
- console-table-printer
- Inquirer
- dotenv

## Syntax and Conventions
- Javascript es6 and above
    - Classes
    - Async await and promises
