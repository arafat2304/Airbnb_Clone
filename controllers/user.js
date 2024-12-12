const User=require("../module/user");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("./user/signup.ejs");
}

module.exports.signUp=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        let registerUser=await User.register(newUser,password);

        req.login(registerUser,(err)=>{
            if(err){
                next(err);
            }else{
                req.flash("success",`welcome ${username}`);
                res.redirect("/listings");
            }
           
        })
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signUp");
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./user/login");
}

module.exports.login=async(req,res)=>{
    req.flash("success","welcome to wonderlust");
    res.redirect(res.locals.redirectUr);
}

module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        next(err);
        req.flash("success","you are logout successfully");
        res.redirect("/listings");
    })
}