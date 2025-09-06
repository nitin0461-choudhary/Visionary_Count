import mongoose ,{ Schema } from "mongoose";
import { assetSchema } from "./common/asset.schema.js";

const graphHistorySchema=new Schema(
    {
        owner:{type:Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true

        },
        video: {
            type:Schema.Types.ObjectId,
            ref:"VideoUpload",
            required:true,
            index:true
        },
        inputParams:{type:mongoose.Schema.Types.Mixed,default:{}},
        graphData:{
            type:Schema.Types.Mixed,
            default:{}
        },
        artifacts:{
            type:[assetSchema],default:[]
        },
        deleted:{
            type:Boolean,default:false,index:true
        },
    },
    {
        timestamps:true,
    }
);
graphHistorySchema.index({owner:1,createdAt:-1});
export const GraphHistory=mongoose.model("GraphHistory",graphHistorySchema);