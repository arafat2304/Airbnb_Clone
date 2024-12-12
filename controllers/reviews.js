const Review=require("../module/review");
const Listing=require("../module/listing");


module.exports.addReview=async(req,res)=>{
    let newReview=await new Review(req.body.review);
    newReview.author=req.user._id;
 
    let listing=await Listing.findById(req.params.id);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","Review Added");
    res.redirect(`/listings/${req.params.id}`)
    
 }

 module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
 }