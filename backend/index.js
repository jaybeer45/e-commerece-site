require('dotenv').config();

const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require('os');
const { log, error } = require('console');

app.use(express.json());
app.use(cors());

// Database connection
const port = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

// API Creation
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});


// Schema Creating for User Model 

const User = mongoose.model('User', {
    name:{
        type:String,
    }, 

    email:{
        type:String,
        unique:true,
    }, 

    password:{
        type:String,   
    },
    cartData:{
        type:Object,
    },

    date:{
       type:Date,
       default:Date.now,
    }
})

// Creating Endpoint for registering for User 

app.post('/signup', async(req, res)=>{
    let check = await User.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({success:false, errors:"existing user found with same email address"})
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
         cart[i]=0 ;       
    }

    const user  = new User({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,  
    })

    await user.save();

    const data = {
         user:{
            id:user.id 
         }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true, token})
})

const upload = multer({ storage });

// Serve static images
app.use("/images", express.static(path.join(__dirname, "upload/images")));

// Upload Endpoint for images
app.post("/upload",upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for Products
const Product = mongoose.model("Product", {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    new_price: { type: Number, required: true },
    old_price: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    avilable: { type: Boolean, default: true },
});

// Add Product Endpoint
app.post("/addproduct", async (req, res) => {
 let lastProduct = await Product.findOne().sort({ id: -1 });
  let id = lastProduct ? lastProduct.id + 1 : 1;
    const product = new Product({
        id:id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });

    console.log(product);
    await product.save();
    console.log("Saved");

    res.json({
        success: true,
        name: req.body.name,
    });
});

// Creating API for deleting product 

app.post("/removeproduct",async  (req, res)=>{
      await Product.findOneAndDelete({id:req.body.id}) ;
      console.log("Removed");

      res.json({
        success:true,
        name:req.body.name,
      });
})

// creating API for getting all product 
 app.get("/allproducts", async(req, res)=>{
    const products = await  Product.find({}) ;
    res.send(products);
 })

 // Creating endpoint for user login 

 app.post('/login', async(req, res)=>{
    let user = await User.findOne({email:req.body.email});
      if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({
                success:true, token    })
        }else{
            res.json({success:false,errors:"wrong password"});
        }
        
      }
      else{
            res.json({success:false,errors:"Wrong  Email Id"});
        }
 });

 // Creatig endpoint for newcollection data 

  app.get('/newcollections', async(req , res)=>{
    let products = await Product.find({})
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched ");
    res.send(newcollection) ;
  })

  // Creating endpoint for popural in women section 

  app.get('/popularinwomen', async(req, res)=>{
          const products = await  Product.find({category:"women"});
          const popular_in_women = products.slice(0,4);
          console.log("Popular in women Fetched");
          res.send(popular_in_women);
  })



 
 // Creating middleware to fetch user 

 const fetchUser  = async(req, res, next) =>{
    const token = req.header('auth-token')

    if(!token){
        res.status(401).send({errors:"pleace authanticate using a valid token  "})
    } 
    else{
        try{
             const data = jwt.verify(token, 'secret_ecom')
             req.user = data.user;
             next() 
        } catch(error) {
               res.status(401).send({errors:"pleace authenticate using a valid token  "})
        }
    }
 }

 
  // Creating Endpoint for adding products in cartdata
 app.post('/addtocart', fetchUser, async(req, res)=>{
   let userData = await User.findOne({_id:req.user.id})
   userData.cartData[req.body.itemId] += 1;
   await User.findOneAndUpdate({id:req.user.id},{cartData:userData})
   res.send("Added") ;
 })

 // Creaating endpoint to remove product from the cartdata

 app.post('/removefromcart',fetchUser,async(req,res)=>{
     let userData = await User.findOne({_id:req.user.id})
     if(userData.cartData[req.body.itemId]>0)
   userData.cartData[req.body.itemId] -= 1;
   await User.findOneAndUpdate({id:req.user.id},{cartData:userData})
   res.send("removed") ;
        
 })


app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
