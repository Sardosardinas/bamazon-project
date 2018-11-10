//SQL request
const mysql = require("mysql");
const inquirer = require("inquirer");
const Table = require("cli-table3");

//connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    
    //Local port
    port: 3307,
    
    user: "root",

    //password
    password: "",
    database: "bamazon",
    

});

connection.connect(function(err){
    if (err) throw err;
    console.log("conected as id" + connection.threadId + "\n");
    checkBuy();
});


var checkBuy = function (){
    connection.query(" SELECT * FROM products", function(err, res){
        
        //creates a table in the console to make the information easier-looking
        var table = new Table({
            head: ['Id', 'Product Name', 'Department', 'Price', 'Stock Quantity']
        });

        //Displays the items available
        console.log("Items available:");
        console.log("=================================")
        
        for(var i =0; i < res.length; i++) {
            //this forloop is calling each part of information of the table in MySQL
            table.push ([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        console.log("---------------------------------");

        //Logs the table with the items in for purchase
        console.log(table.toString());
        inquirer.prompt([{
            
            name: "item_id",
            type: "input",
            message: "Please type the item Id of the product you want to buy",
            validate: function(value){
                if (isNaN(value)== false){
                    return true;
                } else{
                     return false;
                }
            }
        }, {
            name: "stock_quantity",
            type: "input",
            message: "Please type the quantity desired for selected item",
            validate: function(value) {
                if(isNaN(value)== false) {
                    return true;
                } else {
                    return false;
                }
            }
        }]).then(function (answer) {
            var chosenId = answer.item_id - 1;
            var chosenProduct = res[chosenId];
            var chosenQuantity = answer.stock_quantity;
            if (chosenQuantity < chosenProduct.stock_quantity) {
                console.log("Your total for" + "(" + answer.stock_quantity + ")" + " - " + res[chosenId].product_name + " is: " + res[chosenId].price.toFixed(2) * chosenQuantity);
                connection.query("UPDATE products SET ? WHERE ?", [
                {
                    
                    stock_quantity: chosenProduct.stock_quantity - chosenQuantity

                }, 
                {
                    item_id: answer.item_id

                }
            ], function (err, res) {
                    
                    checkBuy();
                });
            } else {
                console.log("Sorry, insufficient Quantity. The Stock available is " + res[chosenId].stock_quantity + " items.");
                checkBuy();
            }
        })
    })
}