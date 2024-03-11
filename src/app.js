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



// app.get('/get-schema-data/:schemaName', (req, res) => {
//     const schemaName = req.params.schemaName;

//     // Check if the requested schema exists
//     if (schemasData.hasOwnProperty(schemaName)) {
//         const schemaData = schemasData[schemaName];
//         res.json(schemaData); // Return the data for the requested schema
//     } else {
//         res.status(404).send('Schema not found'); // Handle case where schema doesn't exist
//     }
// });




//export {app}


























export {app}