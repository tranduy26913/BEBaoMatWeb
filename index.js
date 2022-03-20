import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import {UserRoute,AuthRoute, NovelRoute, CommentRoute} from './routers/index.js'

dotenv.config()


const app=express();
const PORT = process.env.PORT ||5000;
const URI=process.env.MONGODB_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({ credentials: true, origin:true}));
app.use(cookieParser());

mongoose.connect(URI)
    .then(()=>{
        console.log('Connected')
        
    }).catch(err=> {
        console.log('err',err)
    })

    

app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} `)
        })
app.get('/',(req,res)=>{
        res.send('SUCCESS');
    });
app.use('/api',AuthRoute)
app.use('/api/user',UserRoute)
app.use('/api/novels',NovelRoute)
app.use('/api/comment',CommentRoute)