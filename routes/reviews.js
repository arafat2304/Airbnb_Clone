const express=require("express");
const route=express.Router({mergeParams:true});
const wrapAsync =require("../utilis/wrapAsync");
const {isLoggIn}=require("../middlewear.js");
const Review= require("../module/review.js");
const Listing= require("../module/listing.js");
const {validateReview,isReviewAuthor}=require("../middlewear.js");
const reviewControlers=require("../controllers/reviews.js");



// add review
route.post("/",isLoggIn,validateReview,wrapAsync(reviewControlers.addReview));

// Delete reviews

route.delete("/:reviewId",isReviewAuthor,wrapAsync(reviewControlers.destroyReview));


module.exports=route;
