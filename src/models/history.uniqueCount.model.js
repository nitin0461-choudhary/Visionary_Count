import mongoose , { Schema } from "mongoose";

import { assetSchema } from "./common/asset.schema.js";

const uniqueCountHistorySchema= new mongoose.Schema(
    {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "VideoUpload", required: true, index: true },
    inputParams:{
        type:mongoose.Schema.Types.Mixed,default:{}
    },
    countsByClass:{
        type:Map,of:Number,default:{}
    },
    artifacts: { type: [assetSchema], default: [] },



    },
    { timestamps:true }
);
uniqueCountHistorySchema.index({ owner:1,createdAt:-1 });
export const UniqueCountHistory=mongoose.model("UniqueCountHistory",uniqueCountHistorySchema);
