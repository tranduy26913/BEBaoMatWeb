import mongoose from 'mongoose'
import { Comment } from './Comment.js';
import { Reading } from './Reading.js';
import { Chapter } from './Chapter.js';
const schema =new  mongoose.Schema({
    tentruyen:{
        type: String,
        require: true,
    },
    tacgia:{
        type: String,
        require: true,
    },
    theloai:{
        type: String,
        require: true,
    },
    danhgia:{
        type: Number,
        require: true,
        default:0
    },
    luotdoc:{
        type: Number,
        require: true,
        default:0
    },
    hinhanh:{
        type: String,
        require: true,
    },
    nguoidangtruyen:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    noidung:{
        type: String,
        require: true,
        default:"Mô tả truyện đọc",
        validate:{
            validator:item=>{
                return item.length > 10
            },
            message:"Nội dung phải dài hơn 10 kí tự"
        }
    },
    soluongdanhgia:{
        type: Number,
        require: true,
        default:0
    },
    trangthai:{
        type: String,
        require: true,
        default:"Đang ra"
    },
    url:{
        type: String,
        require: true,
    },
    sochap:{
        type:Number,
        required:true,
        default:0
    }
},
{timestamps:true}
)
schema.index({tentruyen:'text'})
schema.pre('deleteOne',{ query: true, document: false }, async function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    let id=this.getQuery()['_id'];
    console.log(id)
    await Comment.deleteMany({dautruyenId:id});
    await Reading.deleteMany({dautruyenId:id});
    await Chapter.deleteMany({dautruyenId:id});
    next();
});



export const Novel = mongoose.model('Novel', schema)