import { execute } from "../../db/databsesetupmysql.js";
import {asyncHandler} from  "../../utils/asyncHandler.js"; // import async handler class 
import {ApiError} from "../../utils/ApiError.js";


import { ApiResponse } from "../../utils/ApiResponse.js";

import  Jwt  from "jsonwebtoken";

const PostUserDetailFetch = asyncHandler(async(req,res)=>{
    const { username, password, user_email, user_fullname } = req.body;


const insertQuery = `INSERT INTO test.persons(username, password, user_email, user_fullname) VALUES (?, ?, ?, ?)`;


      
try {
    // Execute the SQL query with the provided data
    await execute(insertQuery, [username, password, user_email, user_fullname]);

    // Respond with success message
    const response = new ApiResponse(200, req.body, "User data inserted successfully");
    res.send(response);
} catch (error) {
    // Handle errors
    console.error("Error inserting user data:", error);
    throw new ApiError(500, "Failed to insert user data");
}
})



export default PostUserDetailFetch   

