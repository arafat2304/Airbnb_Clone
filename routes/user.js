const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../module/user");
const wrapAsync =require("../utilis/wrapAsync");
const passport=require("passport");
const {redirectUrl}=require("../middlewear");
const userControlers=require("../controllers/user");

router.route("/signUp")
.get(userControlers.renderSignUpForm) //SignUp Form Render
.post(wrapAsync(userControlers.signUp)) // actually signUp

router.route("/login")
.get(userControlers.renderLoginForm) //Login Form Render
.post(redirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),userControlers.login) //Actually logIn

//LogOut
router.get("/logOut",userControlers.logOut);

module.exports=router;