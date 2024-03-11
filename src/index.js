// require('dotenv').config({path: './env'})

import dotenv from "dotenv"

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";

//import connection db from db index.js
import connectDB from "./db/index.js"
import { app } from "./app.js"
import mysql from 'mysql2/promise';
// import Pool from "./db/databaseindex.js";



dotenv.config({
  path: './env'
})


// connectDB()
// .then( () =>{
//   app.listen(process.env.PORT || 8000 , () =>{
//     console.log(`surver is running at port : ${process.env.PORT} `);
//   })
// })  // we used async function then it will  return promise also 
// .catch((err) =>{      
//   console.log("MONGO db connection failed!!",err);
// })
    


app.listen(process.env.PORT || 8000, () => {    
  console.log(`Server is running at port : ${process.env.PORT} `);    
});
   


/*
import express from "express"

const app = express()

( async ()=>{
    try{
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
      app.on("errror",(error) =>{
        console.log("ERRR:",error);
        throw error
      })

      app.listen(process.env.PORT,() =>{
        console.log(`App is listening on port ${process.env.PORT}`);
      })
    } catch(error){
        console.error("ERROR",error)
        throw err
    }
}) ()
  

*/


