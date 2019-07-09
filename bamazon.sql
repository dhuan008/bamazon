DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(7,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Google Chromecast 3rd gen', 'Electronics', 25, 500), 
('Google Home Mini', 'Electronics', 25, 2500),
('Chromecast Ultra', 'Electronics', 54, 50),
('Cards Against Humanity', 'Card Games', 25, 400),
('Alita: Battle Angel', 'Movies', 17.96, 1796),
('Avengers: Endgame', 'Movies', 19.99, 0),
('Super Smash Bros. Ultimate', 'Video Games', 59.90, 5990),
('They Are Billions!', 'Video Games', 26.99, 99),
('Logitech MX Master 2S', 'Electronics', 87.67, 274),
('EVGA GeForce RTX 2080ti FTW3', 'GPU', 1399.99, 42),
('Nvidia Geforce RTX 2080ti Founders Edition', 'GPU', 1129.95, 18),
('New Phone, Who Dis?', 'Card Games', 19.99, 500);

SELECT * FROM products;