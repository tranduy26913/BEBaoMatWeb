import mongoose from "mongoose";

const scheme = new mongoose.Schema({
    dautruyenId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Novel",
        required:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },
    chapNumber:{
        type: Number,
        required:true
    }
})

export const Reading = mongoose.model("Reading",scheme)