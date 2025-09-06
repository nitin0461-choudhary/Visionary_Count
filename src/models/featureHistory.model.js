// import mongoose,{Schema} from "mongoose";
// const FeatureHistorySchema=new Schema(
//     {
//         //Who triggered the feature
//         user:{
//             type:Schema.Types.ObjectId,
//             ref:"User",
//             required:true,
//             index:true,
//         },
//         //on which video
//         video:{
//             type:Schema.Types.ObjectId,
//             ref:"Video",
//             required:true,
//             index:true,
//         },
//         //what type of feature was run
//         type:{
//             type:String,
//             required:true,
//             enum:["GRAPH","UNIQUE_COUNT","BBOX"],
//             index:true,
//         },
//         //index parameters that user gave
//         params:{
//             limit:{
//                 type:Number ,
//                 min:0
//             },
//             classes:{
//                 type:[String],
//                 default:[],
//             },
//         },
//         //minimal result snapshot
//         result:{
//             //For UNIQUE_COUNT
//             uniqueCounts:{
//                 type:[{className:String,count:Number}],
//                 default:undefined,
//             },
//             //For BBOX
//             bboxVideoUrl:{type:String,trim:true},
//         },

//     },
//     {timestamps:true}
// );
// //Help query "last run per video/feature"
// FeatureHistorySchema.index({user:1,video:1,type:1,createdAt:-1});
// export const FeatureHistory=mongoose.model("FeatureHistory",FeatureHistorySchema)

