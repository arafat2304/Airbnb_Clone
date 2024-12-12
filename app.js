if(process.env.NODE_ENV!="product"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expressError =require("./utilis/expressError");
const listingsRoute=require("./routes/listings.js");
const reviewsRoute=require("./routes/reviews.js");
const userRoute=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./module/user.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const user = require("./module/user.js");
const { error } = require('console');

dbURL=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto: {
        secret: 'mySuperSecretCode'
      },
      touchAfter:24*3600,
})

store.on(error,()=>{
    console.log("error in mongoAtlas",error);
})
const sessionOption={
    store,
    secret:"mySuperSecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
}
app.use(session(sessionOption));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use(express.json());

// const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";


main()
.then((res)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(dbURL);
}

app.listen(8080,(req,res)=>{
    console.log("server started");
});

//Root route
app.get("/",(req,res)=>{
    res.send("hii I am root");
})



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.CU=req.user;
    next();
})

app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);

//Error handler

app.all("*",(req,res,next)=>{

    throw new expressError(404,"PAGE NOT FOUND") ;
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message}=err;
    res.status(statusCode).render("listings/error.ejs",{message});
})