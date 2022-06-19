import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import {UserRoute,AuthRoute, NovelRoute, CommentRoute} from './routers/index.js'
import helmet from "helmet";

dotenv.config()

const app=express();
const PORT = process.env.PORT ||5000;
const URI=process.env.MONGODB_URL;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true,limit:'50mb'}))
app.use(cors({ credentials: true, origin:"https://febaomatweb.vercel.app"}));//fix lỗi cross-domain
//app.use(cors({ credentials: true, origin:true}));
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 50 
});
app.use(limiter)
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 3
});

app.use("/auth/login", loginLimiter);
 

//app.use(cors({ credentials: true, origin:"https://febaomatweb.vercel.app"}));//fix lỗi cross-domain
app.use(cors({ credentials: true, origin:true}));
app.use(cookieParser());
app.disable('x-powered-by');//fix lỗi leak info from x-powered-by
app.use(helmet())
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
       defaultSrc: ["'self'"],  // default value for all directives that are absent
       scriptSrc: ["'none'"],   // helps prevent XSS attacks
       frameAncestors: ["'none'"],  // helps prevent Clickjacking attacks
       styleSrc: ["'none'"],
       fontSrc:["'none'"],
       formAction:["'none'"],
       objectSrc:["'none'"]
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