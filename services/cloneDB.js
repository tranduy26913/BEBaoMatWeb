import fetch from 'node-fetch'
import { Novel } from '../models/Novel.js'
import { User } from '../models/User.js'
import mongoose from 'mongoose'
import { Chapter } from '../models/Chapter.js'
export const CloneNovel = async (req, res) => {
    try {
        
        fetch("https://novelbe.herokuapp.com/api/novels/?page=0&size=10&sort=tentruyen&status=None")
            .then(response => {
                return response.json()
            })
            .then(async(json) => {
                const data = json
                console.log(typeof data)
                const admin = await User.findOne({ email: "tranbaoduy4@gmail.com" })
                let i = 0
                data.map(async (item) => {
                    console.log(item)
                    const novel = new Novel({
                        ...item,
                        nguoidangtruyen: admin.id
                    })
                    console.log(i++)
                    await novel.save()
                })

                res.status(200).json("Thanh cong")
            })
            .catch(err => {
                console.log(err)
            })

    } catch (error) {
        console.log(error)
    }
}

export const CloneChapter = async (req, res) => {
    try {
        fetch("http://localhost:8080/api/novels/novel/chuong")
            .then(response => {
                return response.json()
            })
            .then(async(json) => {
                const data = json
                const novel1=new mongoose.Types.ObjectId("622015a45d8076656b3a3eb6")
                const novel2=new mongoose.Types.ObjectId("62201a7cb598d336f362dd4f")
                const novel3=new mongoose.Types.ObjectId("6220156381ed8e2841dbd810")
                const novel4=new mongoose.Types.ObjectId("62200f8ec8f4590191ba0061")
                const novel5=new mongoose.Types.ObjectId("62201a54b3fead562622156c")
                console.log(novel1.getTimestamp().getTime()/1000)
                const ids =[
                    {
                        n:novel1,
                        key:"6228847524448ca87d2a5fa2"
                    },
                    {
                    n:novel2,
                    key:"6228847524448ca87d2a5fa1"},
                    {
                    n:novel3,
                    key:"6228847524448ca87d2a5fa5"},
                    {
                    n:novel4,
                    key:"6228847524448ca87d2a5fa3"},
                    {
                    n:novel5,
                    key:"6228847524448ca87d2a5fa4"}
                ]
                let i=0

                
                data.forEach(async (item) => {

                    const {dautruyenId}=item
                    let key=""
                    ids.forEach((novel)=>{
                        if(novel.n.getTimestamp().getTime()/1000===dautruyenId.timestamp){
                            key = novel.key
                        }
                    })
                    const id = new mongoose.Types.ObjectId(key)
                     const chapter = new Chapter({
                        ...item,
                        dautruyenId:id
                    })
                   await chapter.save()
                })

                res.status(200).json("Thanh cong")
            })
            .catch(err => {
                console.log(err)
            })

    } catch (error) {
        console.log(error)
    }
}