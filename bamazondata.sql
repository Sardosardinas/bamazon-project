DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR(100),
department_name VARCHAR(50),
price DECIMAL(10,2) NOT NULL,
stock_quantity INTEGER NOT NULL,
PRIMARY KEY(item_id)
);

INSERT INTO bamazon.products(product_name, department_name, price, stock_quantity)
VALUES("Animal Beauty Face Mask", "Beauty", 20.30, 20);

SELECT * FROM bamazon.products;