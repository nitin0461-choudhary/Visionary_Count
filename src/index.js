import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // forces reading your .env in project root

import mongoose from 'mongoose';
//import dotenv from "dotenv";
import {app} from './app.js';
import connect_db  from './db/index.js';
//dotenv.config();
connect_db().then(()=>{
let PORT1=process.env.PORT||8000;
app.listen(PORT1,()=>{
  console.log(`App is listening on the port : ${PORT1}`)
})
})
.catch((error)=>{
    console.log("Mongodb connection gets failed due to this error:",error);
})
