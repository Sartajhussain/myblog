export const likeComment = async(req,res)=>{
    try{

        const {commentId} = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if(!comment){
            return res.status(404).json({message:"Comment not found"});
        }

        const alreadyLiked = comment.likes.includes(userId);

        if(alreadyLiked){

            comment.likes.pull(userId);

        }else{

            comment.likes.push(userId);

        }

        await comment.save();

        res.json({
            success:true,
            likes:comment.likes.length
        });

    }catch(err){
        res.status(500).json({
            success:false
        });
    }
}