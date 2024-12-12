const { string } = require("joi");
const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
    comment:{
        type:String,
    },
    rating:{
        type:String,
        min:0,
        max:5,
    },
    createdAt:{
        type:String,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
});

module.exports= mongoose.model("Review",reviewSchema);