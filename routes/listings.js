const express=require("express");
const router=express.Router()
const mongoose=require("mongoose");
const wrapAsync =require("../utilis/wrapAsync");
const Listing= require("../module/listing.js");
const {isLoggIn,redirectUrl,isOwner,validateListing}=require("../middlewear.js");
const listingControlers=require("../controllers/listings.js");
const multer=require("multer");
const {storage}=require("../cloudinaryConfige.js");
const upload = multer({ storage });

router.route("/category")
.get(async(req,res)=>{
    let op = req.query.q;

     let allListings= await Listing.find({});

    res.render("./listings/options",{allListings,op});
})

router.route("/find")
.post(async(req,res)=>{
    let value=req.body;
    console.log(value);
    let allListings= await Listing.find({});
    res.render("./listings/search",{allListings,value});
})

router.route("/")
.get(wrapAsync(listingControlers.index)) // Index route
.post(upload.single('listing[image]'),validateListing,isLoggIn,wrapAsync(listingControlers.createListing));//this for new listing creation

//NEW route
router.get("/new",isLoggIn,listingControlers.renderNewListingForm);

router.route("/:id")
.get(wrapAsync(listingControlers.showListing)) //SHOW route
.put(isLoggIn,upload.single('listing[image]'),validateListing,isOwner,wrapAsync(listingControlers.updateEdit)) //Update
.delete(isLoggIn,isOwner,wrapAsync(listingControlers.destroyListing));//Delete


//EDIT route
router.get("/:id/edit",isLoggIn,isOwner,wrapAsync(listingControlers.renderEditForm));

module.exports=router;