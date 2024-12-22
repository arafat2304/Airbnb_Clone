const mongoose=require("mongoose");
let sampleListings=require("./data.js");
const Listing = require("../module/listing.js");
const multer=require("multer");
const {storage}=require("../cloudinaryConfige.js");
const upload = multer({ storage });
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
MY_ACCESS_TOKEN=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: "pk.eyJ1IjoiYXJhZmF0bWFsZWsiLCJhIjoiY200OXBtdTlyMDlubDJpc2o2dWtoMDAyaSJ9.OFdPLGKkGmDysK6dQ1RFiw" });


const MONGO_URL="mongodb://127.0.0.1:27017/wonderlust";

main()
.then((res)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    mongoose.connect(MONGO_URL);
}

async function initDB (){

    list=await new Listing({sampleListings});
    let cordinate=await geocodingClient.forwardGeocode({
        query: sampleListings.location,
        limit: 1,
      })
        .send()
    
      list.geometry=cordinate.body.features[0].geometry;
      

      await list.save()
      .then(()=>{
        console.log("success");
      })
}

initDB();