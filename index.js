import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import {UserRoute,AuthRoute, NovelRoute, CommentRoute} from './routers/index.js'
import * as helmet from "helmet";

dotenv.config()


const app=express();
const PORT = process.env.PORT ||5000;
const URI=process.env.MONGODB_URL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({ credentials: true, origin:"https://tranduy26913.github.io"}));//fix lỗi cross-domain
//app.use(cors({ credentials: true, origin:true}));
app.use(cookieParser());
app.disable('x-powered-by');//fix lỗi leak info from x-powered-by
app.use(helmet.frameguard())//fix lỗi clickjacking
app.use(helmet.noSniff());//fix lỗi X-Content-Type-Options Header Missing
app.use(helmet.xssFilter());
app.use(
    helmet.hsts({
      maxAge: 31000000,
      preload: true,
    })
  );

app.use(helmet.contentSecurityPolicy({
   directives: {
       defaultSrc: ["'none'"],  // default value for all directives that are absent
       scriptSrc: ["'self'"],   // helps prevent XSS attacks
       frameAncestors: ["'none'"],  // helps prevent Clickjacking attacks
       styleSrc: ["'none'"],
       fontSrc:["'none'"]
    }
}))

app.use(
    helmet.referrerPolicy({
      policy: ["no-referrer"],
    })
  );


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