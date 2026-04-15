import Reply from "../models/reply.model.js";

export const addReply = async(req,res)=>{
    try{

        const {commentId,text} = req.body;

        const reply = await Reply.create({
            comment:commentId,
            user:req.user._id,
            text
        });

        res.status(201).json({
            success:true,
            reply
        });

    }catch(err){

        res.status(500).json({
            success:false
        })

    }
}