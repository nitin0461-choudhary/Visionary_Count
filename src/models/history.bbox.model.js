import mongoose  ,{Schema} from "mongoose";
import { assetSchema } from "./common/asset.schema.js";

const bboxHistorySchema= new Schema(
    {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: "VideoUpload", required: true, index: true },
    inputParams:{
        type:Schema.Types.Mixed,
        default:{}

    },
    overlayVideo:{ type:assetSchema,required:true },
    artifacts: {type:[assetSchema],default:[]},
    deleted:{ type:Boolean,default:false,index:true },
    },
    { timestamps: true }
);
bboxHistorySchema.index({ owner:1,createdAt:-1 });
export const BboxHistory = mongoose.model("BboxHistory",bboxHistorySchema );