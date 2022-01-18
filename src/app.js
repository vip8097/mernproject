require('dotenv').config();
const express = require('express');
const app = express();
const path = require("path");
const hbs = require("hbs");
const bcrypt = require('bcryptjs');

require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");


const port = process.env.PORT || 3000;

// console.log(process.env.SECRET_KEY);

const static_path = path.join(__dirname, "../public");
const templet_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

// it provie json file to convert
app.use(express.json());
app.use(express.urlencoded({extended:false})); // form to get data not undefine

// console.log(__dirname, "../templates/partials");
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templet_path);
hbs.registerPartials(partials_path);


app.get("/index", (req, res) => {
    res.render("index.hbs");
});

// register to define
app.get("/register", (req,res) => {
    res.render("register");
})

// login to define
app.get("/login", (req,res) => {
    res.render("login");
})

//create a new user in our database
app.post("/register", async (req,res) => {
    try {

        // console.log(req.body.confirmpassword);
        // res.send(req.body.confirmpassword);

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword:cpassword
            })
            
            console.log("the success part" + registerEmployee);

            //generateAuthToken() call
            const token = await registerEmployee.generateAuthToken();
            console.log("the token part" + token);

            const registered = await registerEmployee.save();
            console.log("the page part" + registered);

            res.status(201).render("index");

        }else{
            res.send("password not matching");
        }

    } catch (error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
})


// login to check
app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        // email and password check in console
    //  console.log(`Emailis ${email} and password is ${password}`);
        
        const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);
        // console.log(useremail);

        const isMatch = await bcrypt.compare(password, useremail.password);

           //generateAuthToken() call
           const token = await useremail.generateAuthToken();
           console.log("the token part" + token);

        if (isMatch) {
            res.status(201).render("index");
        } else {
            res.send("Invalid  Password Details");
        }
        
    } catch (error) {
        res.status(400).send("Invalid login Details");
    }
    
})



// const bcrypt = require("bcryptjs");

// const securePasword = async (password) => {

//     const passwordHash = await bcrypt.hash(password, 10);
//     console.log(passwordHash);

//     const passwordMatch = await bcrypt.compare("vipin", passwordHash)
//     console.log(passwordMatch);
     
// }
// securePasword("vipin");



const jwt = require("jsonwebtoken");

const createToken = async () => {
    const token = await jwt.sign({ _id: "61e53d4c48dcc80f5d14a6c1" }, "mynameisvipinkailashnathpatelmum", { expiresIn:"2sec"
        
    });
    // console.log(token);

    const userVerified = await jwt.verify(token, "mynameisvipinkailashnathpatelmum");
    // console.log(userVerified);
 }

createToken();


app.listen(port,() => {
    console.log(`the connection port is ${port}`);
})


