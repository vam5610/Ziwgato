import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.routes.js';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import shopRouter from './routes/shop.routes.js';
import itemRouter from './routes/item.routes.js';
import orderRouter from './routes/order.routes.js';
import http from "http"
import { Server } from 'socket.io';
import { socketHandler } from './utils/socket.js';

const app= express();
const server= http.createServer(app)
const io= new Server(server,{
  cors:{
    origin:"https://ziwgato-frontend.onrender.com",
    credentials:true,
    methods:["GET","POST"]
  }
})
app.set("io",io);

const PORT= process.env.PORT || 5000;

socketHandler(io)
app.use(cors({
  origin:"https://ziwgato-frontend.onrender.com",
  credentials:true,
}))

  app.use(express.json());
  app.use(cookieParser())
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/shop',shopRouter)
app.use('/api/item',itemRouter)
app.use('/api/order',orderRouter)



server.listen(PORT,()=>{

  connectDb()
  console.log(`Server is running on port ${PORT}`);
})
