import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    dautruyenId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Novel"
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    content:{
        type:String,
        required:true,
        validate:{
            validator:item=>{
                return item.length > 10
            },
            message:"Nội dung phải dài hơn 10 kí tự"
        }
    },
    
},{timestamps:true})

export const Comment = new mongoose.model("Comment",schema) 