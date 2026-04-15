import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
{
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    text:{
        type:String,
        required:true
    }

},
{timestamps:true}
);

export default mongoose.model("Reply",replySchema);