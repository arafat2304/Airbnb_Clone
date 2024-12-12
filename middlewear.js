const Listing=require("./module/listing");
const Review=require("./module/review");
const expressError =require("./utilis/expressError");
const {listingSchema,reviewSchema}=require("./schema");
module.exports.isLoggIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","login first");
        return res.redirect("/login");
    }
    next();
}

module.exports.redirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUr=req.session.redirectUrl;
        console.log(res.locals.redirectUr)
    }else{
        res.locals.redirectUr="/listings";
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(currentUser._id)){
        req.flash("error","you are not owner");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// meadlewear that validate server side review by joi
module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
       let msg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,msg);
    }else{
        next();
    }
    

}

// meadlewear that validate server side review by joi

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
       let msg=error.details.map((el)=>el.message).join(",");
        throw new expressError(400,msg);
    }else{
        next();
    }
    
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(currentUser._id)){
        req.flash("error","you are not owner of this Review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}