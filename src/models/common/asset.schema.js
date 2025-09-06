import mongoose from "mongoose";
import { Schema } from "mongoose";
export const assetSchema=new Schema(
    {
        url:{type:String,required:true},
        public_id:{type:String,default:""},
        resource_type:{type:String,default:"auto"},
        bytes:Number,
        width:Number,
        height:Number,
        format:String,
        duration:Number,
        original_filename:String,
        thumbnail_url:String,
        lable:String,
    },
    { _id:false}
);

