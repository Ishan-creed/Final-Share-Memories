import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
// client id : 694236914677-0et4bnar3f43c60ql5flnbpf8hvts36e.apps.googleusercontent.com
//client secret : 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
import postRoutes from './routes/posts.js';
// import User from "../models/postMessage.js";

const app = express();
app.use('/posts',postRoutes);
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

const PORT = process.env.PORT || 9001;

mongoose.connect('mongodb+srv://ishan:123@cluster0.ilrr1fi.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('mongodb connected successfully');
});
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
    
    
})


const User = new mongoose.model("User", userSchema);


//Routes

app.post("/Login", (req, res) => {
    const{email,password} = req.body;
    User.findOne({email:email},(err,user)=>{
    if(user){
         if(password === user.password){
            res.send({message: "Login Successfull",user:user})
            
    }else{
                res.send({message: "Password did not match"})
            }
        }else{

        res.send("User not registered");
    }
    })
})



app.post("/Register", (req, res) => {
    const { name, email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registered" })
        } else {
            const user = new User({

                name: name,
                email: email,
                password: password
            })
            user.save(err => {
                if (err) {
                    res.send(err);
                } else {
                    res.send({ message: "Successfully registered" })
                }
            })
        }
    })


})

app.listen(9001, () => {
    console.log("BE started at port 9001")
})
