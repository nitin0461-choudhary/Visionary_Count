// import mongoose,{Schema} from "mongoose";
// const ObjectCountSchema=new Schema(
//     {
//         className:{type:String,required:true,trim:true},
//         count:{type:Number,required:true,min:0},
//     },
//     {_id:false}
// );
// const VideoSchema=new Schema(
//     {
//         //Every video belongd to one user
//         owner:{
//             type:Schema.Types.ObjectId,
//             ref:"User",
//             required:true,
//             index:true,
//         },
//         //Original video stored on Cloudinary
//         originalUrl:{
//             type:String,
//             required:true,
//             trim:true
//         },
//         originalPublicId:{
//             type:String,
//             required:true,
//             trim:true
//         },
//         provider:{
//             type:String,
//             required:true,
//             trim:true,
//         },
//         provider:{
//             type:String,
//             default:"cloudinary",
//             trim:true,
//         },
//         //De-duplication per userhash of file contents
//         checksum:{
//             type:String,
//             required:true,
//             index:true,
//         },
//         //Optional  light weight metadata(handy for UI/debug)
//         filename:{
//             type:String,
//             trim:true
//         },
//         //---- Cached results(no frame-level storage)----
//         //Feature 2: unique object counts(cached)
//         uniqueCounts:{
//             type:[ObjectCountSchema],
//             default:[]
//         },

//         uniqueCountsModelVersion:{
//           type:String,
//           trim:true,
//         },
//         uniqueCountsComputedAt:{
//             type:Date
//         },
//         //Feature 3:generated bounding-box video(cached)
//         bboxVideoUrl:{
//             type:String,
//             trim:true,
//         },
//         bboxVideoPublicId:{
//             type:String,
//             trim:true,
//         },
//         bboxModelVersion:{
//             type:String,
//             trim:true,
//         },
//         bboxGeneratedAt:{
//             type:Date
//         },
//     },
//     {
//         timestamps:true,
//     }

// );
// //Prevent duplicate video uploads per user(same bytes)
// VideoSchema.index({owner:1,checksum:1},{unique:true});
// //Also prevent re-adding the same Cloudinary asset for the same user
// VideoSchema.index({owner:1,originalPublicId:1},{unique:true});
// export const Video=mongoose.model("Video",VideoSchema);
import mongoose from "mongoose";
import { Schema } from "mongoose";
const videoSchema= new Schema ({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requuired:true,

    },
    title:{
        type:String,
        required:true,
    }
    ,
    description:{
        type:String,
        required:true,
        index:true,
    },
    checksum:{
        type:String,
        required:true,
        index:true,
    },
    cloudinary:{
        url:{type:String,required:true},
        public_id:{type:String,required:true},
        resource_type:{type:String,default:"video"},
        bytes:Number,
        format:String,
        width:Number,
        height:Number,
        duration:Number,
    },
    deleted:{
        type:Boolean,
        default:false,
    },
   

},
{ timestamps:true }

);
//prevent duplication uploads for same user
videoSchema.index({owner:1,checksum:1},{unique:true});
export const Video=mongoose.model("VideoUpload",videoSchema);