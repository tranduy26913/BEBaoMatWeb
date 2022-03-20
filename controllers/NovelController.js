import { Novel } from "../models/Novel.js"
import { ResponseDetail, ResponseData } from "../services/ResponseJSON.js"
import { Chapter } from "../models/Chapter.js"
import jwt_decode from 'jwt-decode'
import { Reading } from '../models/Reading.js'
import { User } from '../models/User.js'
import mongoose from "mongoose"

export const NovelController = {
    CreateNovel: async (req, res) => {
        try {
            const tentruyen = req.body.tentruyen
            const url = req.body.url
            const hinhanh = req.body.hinhanh
            const theloai = req.body.theloai
            const tacgia = req.body.tacgia
            const nguoidangtruyen = new mongoose.Types.ObjectId(req.body.nguoidangtruyen)
            const novel = await new Novel({ tentruyen, url, hinhanh, theloai, tacgia, nguoidangtruyen })
            let error = novel.validateSync();
            if (error)
                return res.status(400).json(ResponseDetail(400, {
                    message: Object.values(error.errors)[0].message || 'Lỗi'
                }))

            const response = await novel.save()
            if (response) {
                return res.status(200).json(ResponseData(200, novel))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Đăng truyện không thành công" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    EditNovel: async (req, res) => {
        try {
            const tentruyen = req.body.tentruyen
            const url = req.body.url
            const hinhanh = req.body.hinhanh
            const theloai = req.body.theloai
            const tacgia = req.body.tacgia
            const id = new mongoose.Types.ObjectId(req.body.id)
            const username = req.user.sub
            const newUser = await User.findOne({ username: username })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))

            const novel = await Novel.findOne({ _id: id, nguoidangtruyen: newUser.id })
            if (!novel)
                return res.status(400).json(ResponseDetail(400, { message: "Bạn không có quyền sửa truyện của người khác" }))
            const newNovel = await Novel.findByIdAndUpdate(id, {
                tentruyen, url, hinhanh, theloai, tacgia
            }, { new: true })
            if (newNovel)
                return res.status(200).json(ResponseData(200, novel))
            return res.status(400).json(ResponseDetail(400, { message: "Sửa truyện không thành công" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    DeleteNovelByUrl: async (req, res) => {
        try {
            const url = req.query.url

            const user = req.user
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return res.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.nguoidangtruyen.equals(newUser._id)){
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
                }
                    const response = await Novel.deleteOne({ _id: novel._id })
                if(response.deletedCount==1)
                    return res.status(200).json(ResponseData(200, { message: "Xoá truyện thành công" }))
                return res.status(400).json(ResponseDetail(400, { message: "Xoá truyện không thành công" }))

            }
            else
                return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    SearchNovelByName: async (req,res)=>{
        try {
            let search = req.query.search
            if(!search){
                return res.status(500).json(ResponseDetail(500, { message: "Thiếu field" }))
            }
            search = search.normalize("NFD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[\u0300-\u036f]/g, "").split(' ').filter(i=>i!=='').join(' ')
            console.log(search)
            const novels = await Novel.find({$text:{$search:search}})
            if(novels){
                return res.status(200).json(ResponseData(200,novels))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm truyện" }))
        }
    },
    CreateChapter: async (req, res) => {
        try {
            let tenchap = req.body.tenchap
            const content = req.body.content
            const url = req.body.url
            if(content.length<=10)
                return res.status(400).json(ResponseDetail(400, { message: "Nội dung phải dài hơn 10 kí tự" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {

                const newestChap = await Chapter.find({ dautruyenId: novel._id }).sort({ chapnumber: -1 }).limit(1)
                let chapnumber = 1
                if (newestChap.length > 0) {
                    chapnumber = newestChap[0].chapnumber + 1
                }
                tenchap = `Chương ${chapnumber}: ${tenchap}`
                const chapter = await new Chapter({ tenchap, dautruyenId: novel._id, content, chapnumber })
                const response = await chapter.save()
                if (response) return res.status(200).json(ResponseData(200, response))
                return res.status(400).json(ResponseDetail(400, { message: "Đăng chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi đăng truyện" }))
        }
    },
    UpdateChapter: async (req, res) => {
        try {
            let tenchap = req.body.tenchap
            const content = req.body.content
            const url = req.body.url
            const chapnumber = req.body.chapnumber
            const user = req.user
            if(content.length<=10)
                return res.status(400).json(ResponseDetail(400, { message: "Nội dung phải dài hơn 10 kí tự" }))
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.nguoidangtruyen.equals(newUser._id))
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền sửa truyện của người khác" }))
                const newChap = await Chapter.findOneAndUpdate({ chapnumber, dautruyenId: novel.id }, { content, tenchap }, { new: true })
                if (newChap) return res.status(200).json(ResponseData(200, newChap))
                return res.status(400).json(ResponseDetail(400, { message: "Sửa chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    DeleteChapter: async (req, res) => {
        try {
            const url = req.query.url
            const chapnumber = req.query.chapnumber
            const user = req.user
            const newUser = await User.findOne({ username: user.sub })
            if (!newUser)
                return req.status(405).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                if (!novel.nguoidangtruyen.equals(newUser._id))
                    return res.status(403).json(ResponseDetail(403, { message: "Bạn không có quyền xoá truyện của người khác" }))
                const newChap = await Chapter.findOneAndDelete({ chapnumber, dautruyenId: novel.id })
                if (newChap) return res.status(200).json(ResponseData(200, { message: "Xoá chương thành công" }))
                return res.status(400).json(ResponseDetail(400, { message: "Xoá chương không thành công" }))
            }
            return res.status(400).json(ResponseDetail(400, { message: "Không tìm thấy truyện" }))
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi sửa truyện" }))
        }
    },
    GetNovelsByUserId: async (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = req.query.page || 0
            const size = req.query.size || 20
            const id = req.query.id

            Novel.find({ nguoidangtruyen: new mongoose.Types.ObjectId(id) }).limit(size).skip(size * page).sort({ tentruyen: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },

    GetNovels: (req, res) => {
        try {
            const status = req.query.status || 'None'
            const sort = req.query.sort || 'tentruyen'
            const page = req.query.page || 0
            const size = req.query.size || 6

            Novel.find().limit(size).skip(size * page).sort({ tentruyen: -1 })
                .then(result => {
                    res.status(200).json(ResponseData(200, result))
                }).
                catch(err => {
                    console.log(err)
                    res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi GetNovels" }))
        }
    },

    GetNovelsByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            Novel.findOne({ url: url }).then(
                result => {
                    res.status(200).json(ResponseData(200, result))
                }
            ).
                catch(err => {
                    console.log(err)
                    res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
                })
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin truyện" }))
        }
    },

    GetChapterByNumber: async (req, res) => {
        try {
            const chapNumber = req.params.chapNumber;
            const url = req.params.url

            const novel = await Novel.findOne({ url: url })
            if (novel) {
                Chapter.findOne({ dautruyenId: novel.id, chapnumber: chapNumber })
                    .then(
                        result => {
                            console.log(result)
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },

    GetChapterByUrl: async (req, res) => {
        try {
            const url = req.params.url;
            const page = req.query.page || 0
            const size = req.query.size || 1000
            const novel = await Novel.findOne({ url: url })
            if (novel) {
                Chapter.find({ dautruyenId: novel.id })
                    .limit(size)
                    .skip(page * size)
                    .sort({ chapnumber: 1 })
                    .select({ chapnumber: 1, tenchap: 1 }).then(
                        result => {
                            return res.status(200).json(ResponseData(200, result))
                        }
                    ).
                    catch(err => {
                        console.log(err)
                        return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy chap" }))
                    })
            }
            else {
                return res.status(400).json(ResponseDetail(500, { message: "Không tìm thấy truyện" }))
            }
        } catch (error) {
            console.log(error)
            res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    }

    ,
    SetReading: async (req, res) => {
        try {
            const chapNumber = req.body.chapNumber
            const url = req.body.url
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            User.findOne({ username: username })
                .then(async (result) => {
                    const novel = await Novel.findOne({ url: url })
                    if (novel) {

                        let reading = await Reading.findOne({
                            dautruyenId: novel.id,
                            userId: result.id
                        })
                        if (reading) {
                            reading.chapNumber = chapNumber
                        }
                        else {
                            reading = await new Reading({
                                dautruyenId: novel.id,
                                userId: result.id,
                                chapNumber
                            })
                        }
                        const temp = await reading.save()
                        return res.status(200).json(ResponseData(200, temp))
                    }
                    return res.status(500).json(ResponseDetail(500, { message: "Không tìm thấy tài khoản" }))
                })
                .catch(err => {
                    return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
                })
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    },
    GetReadings: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const decode = jwt_decode(token)

            if (!decode.sub) {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi token" }))
            }
            const username = decode.sub;
            const user = await User.findOne({ username: username })
            if (user) {
                const readings = await Reading.find({ userId: user.id }).populate('dautruyenId')

                return res.status(200).json(ResponseData(200, readings))
            } else {
                return res.status(500).json(ResponseDetail(500, { message: "Lỗi tìm tài khoản" }))
            }
        } catch (error) {
            console.log(error)
            return res.status(500).json(ResponseDetail(500, { message: "Lỗi lấy thông tin chap" }))
        }
    }

}