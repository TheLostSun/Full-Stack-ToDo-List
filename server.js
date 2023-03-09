const express =require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();

mongoose.connect('mongodb://127.0.0.1:27017/todolist');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const itemSchema=new mongoose.Schema({
    name:String
});

const itemModel=mongoose.model("Item",itemSchema);

const item1=new itemModel({
    name:"Buy food"
});
const item2=new itemModel({
    name:"Cook food"
});
const item3=new itemModel({
    name:"Eat food"
});

const defaultItems=[item1,item2,item3];


app.get("/",function(req,res){
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var day=today.toLocaleDateString("en-US",options);
    
    itemModel.find().then(function(foundItems){
    if(foundItems.length===0)
    {
           itemModel.insertMany(defaultItems);
    }
    else
    {
        res.render('list',{kindOfDay:day,newlistItem:foundItems});
    }
});
});

app.post("/",function(req,res)
{
    var item=req.body.name;
    const newItem=new itemModel({
        name:item
    });
    newItem.save();
    res.redirect("/");
})

app.post("/delete",function(req,res)
{
    const checked=req.body.checkbox;
    itemModel.findByIdAndRemove(checked).then(function(){res.redirect("/")});
})

app.get("/about",function(req,res){
    res.render('about');
})
app.listen(3000,function(){console.log("Server is running on Port 3000");});

//Using custom made node modules.

const testPackageModule=require(__dirname+"/testPackage.js");
console.log(testPackageModule.getDate());