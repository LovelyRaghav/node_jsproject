
import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controllers.js";
import UserDetailsFetch from "../controllers/UserDetailsFetch/UserDetailsFetch.js"
import PostUserDetailFetch from "../controllers/UserDetailsFetch/UserMySql.controllers.js"
import UserAuthentication from "../controllers/userauth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import  logger  from '../config/logger.js';





const router = Router();

const routes = [
    { path: "/register", method: "post", middleware: [], handler: registerUser },
    { path: "/login", method: "post", middleware: [], handler: loginUser },
    { path: "/logout", method: "post", middleware: [verifyJWT], handler: logoutUser },
    { path: "/refresh-token", method: "post", middleware: [], handler: refreshAccessToken },
    { path: "/userDetails", method: "get", middleware: [], handler: UserDetailsFetch },

     {path: "/postUserDetail",method: "post",middleware:[],handler:PostUserDetailFetch},
     {path:"/userAuthentication",method:"post",middleware:[],handler:UserAuthentication}

];

routes.forEach(route => {

    //router.route(route.path)[route.method](...route.middleware, route.handler);    
    router.route(route.path)[route.method](...route.middleware, async(req,res,next)=>{
    try{
        // Log the incoming request
        logger.info(`Received ${route.method.toUpperCase()} request for ${route.path}`)
        await route.handler(req,res,next)

    }catch(error){
     //log any error occured
     logger.error(`Error proccessing ${route.method.toUpperCase()} request for  ${route.path}: ${error.message} `)
     next(error);
    }
    });
      
});




// app.get('/get-schema-data/:schemaName', (req, res) => {
//     const schemaName = req.params.schemaName;

//     // Fetch data for the requested schema from the database
//     const query = `SELECT * FROM ${schemaName}`;
//     connection.query(query, (err, results) => {
//         if (err) {
//             console.error('Error querying database:', err);
//             res.status(500).send('Error retrieving data from database');
//             return;
//         }
//         res.json(results); // Return the fetched data as JSON response
//     });
// });

export default router 
