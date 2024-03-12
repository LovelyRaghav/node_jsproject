import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


//configure of cors

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))



// this code to accept the json 
app.use(express.json({limit :"10kb"}))
app.use(express.urlencoded({extended : true , limit :"10kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import 
import userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users",userRouter)  // this line trigger in controller   and this /api/v1/users become prefix

 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
});





























export {app}