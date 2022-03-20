import jwt_decode from 'jwt-decode'
import { User } from '../models/User.js';
import { ResponseDetail, ResponseData } from '../services/ResponseJSON.js';
import { Novel } from '../models/Novel.js'
import { Comment } from '../models/Comment.js';

export const CommentController = {
    CreateComment: async (req, res) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const content = req.body.content
            const url = req.body.url
            const username = jwt_decode(token).sub
            const user = await User.findOne({ username: username })
            if (user) {
                const novel = await Novel.findOne({ url: url })
                if (novel) {
                    const comment = await new Comment({
                        dautruyenId: novel.id,
                        userId: user.id,
                        content
                    })
                    const cmtResponse = await comment.save()
                    const data={
                        id:cmtResponse.id,
                        content,
                        image:user.image,
                        tenhienthi:user.tenhienthi,
                        username:user.username,
                        createdAt:cmtResponse.createdAt

                    }
                    return res.status(200).json(ResponseData(200, data))
                } else {
                    return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
                }
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }
        } catch (error) {
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },
    GetCommentsByUrl: async (req, res) => {
        try {
            const url = req.params.url
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                let comments = await Comment.find({
                    dautruyenId:novel.id}).sort({createdAt:-1}).populate('userId')
                comments=comments.map(item=>{return {
                    tenhienthi:item.userId.tenhienthi,
                    image:item.userId.image,
                    content:item.content,
                    id:item.id,
                    username:item.userId.username,
                    createdAt:item.createdAt
                }})
                return res.status(200).json(ResponseData(200, comments))
            } else {
                return res.status(400).json(ResponseDetail(400, { message: 'Không tồn tại tài khoản' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi tạo comment" }))
        }
    },

    DeleteComment: async (req, res) => {
        try {
            const novelId = req.body.id
            console.log(novelId)
            const count=await Comment.findByIdAndDelete(novelId)
            if(count) 
                return res.status(200).json(ResponseData(200, {message:"Xoá thành công"}))
            else {
                return res.status(400).json(ResponseDetail(400, { message: 'Xoá thất bại' }))
            }

        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(200, { message: "Lỗi xoá comment" }))
        }
    }
}