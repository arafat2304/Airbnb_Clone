const Listing=require("../module/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
MY_ACCESS_TOKEN=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: MY_ACCESS_TOKEN });

module.exports.index=async(req,res)=>{
    let allListings=await Listing.find({});

    res.render("./listings/index.ejs",{allListings});
}

module.exports.renderNewListingForm=(req,res)=>{
    res.render("./listings/new.ejs");
}

module.exports.createListing=async(req,res,next)=>{
    let cordinate=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        console.log(req.body.listing)

    let {path:url,filename}=req.file;
    const list= await new Listing(req.body.listing,);
    
    list.owner=req.user._id;
    list.image={url,filename};

    let geo=list.geometry=cordinate.body.features[0].geometry;
      console.log(geo);
    await list.save();
    req.flash("success","Listing created");
    res.redirect("/listings");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews", populate:{path:"author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing is not exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    let originalImage=listing.image.url;
    // originalImage=originalImage.replace("/upload","/upload/h_300,w_300");
    console.log(originalImage);
    if(!listing){
        req.flash("error","Listing is not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing,originalImage});
}

module.exports.updateEdit=async(req,res)=>{
    let {id}=req.params;
     let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});

     let cordinate=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    
      listing.geometry=cordinate.body.features[0].geometry;
      await listing.save()
      console.log(listing);
   if(typeof req.file != "undefined"){
    let{path:url,filename}=req.file;
    listing.image={url,filename};
    await listing.save()
   }
    req.flash("success","Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}

