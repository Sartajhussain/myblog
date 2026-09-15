import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
    {
        email :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        
    },
    {
       timestamps: true, 
    }
);

const newsletter = mongoose.model('Newsletter', newsletterSchema);
export default newsletter;