const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const itemSchema = mongoose.Schema({
    todoItem: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    todoItem: "Buy food"
});

const item2 = new Item({
    todoItem: "Cook food"
});

const item3= new Item({
    todoItem: "Eat food"
});

const defaultList = [item1, item2, item3];

app.get("/", function(req, res) {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-US", options);

    Item.find(function(err, items){
        if(items.length === 0){
            Item.insertMany(defaultList, function(err){
                if(err){
                    console.log(err);
                } else{
                    console.log("Inserted default items successfully");
                }
                res.redirect("/");
            });
        } else{
            res.render("index", {
                day: day,
                newList: items
            });
        }
    });
});

app.post("/", function(req,res) {
    const newItem = req.body.newItem;
    const item = new Item({
        todoItem: newItem
    })
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res){
    const id = req.body.checkBox;

    Item.deleteOne({_id: id}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("One item deleted successfully.")
        }
    });

    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Server is running at port 3000.");
});