import { execute } from "../db/databsesetupmysql.js";
import {asyncHandler} from  "../utils/asyncHandler.js"; // import async handler class 
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';


const UserAuthentication = asyncHandler(async(req,res)=>{
    //access the data from user  
   
    const { password, user_email } = req.body;
    console.log(req.body);

    if (!user_email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    
    
    // SQL query to select the user with the provided email
    let selectQuery = `SELECT user_email, password FROM test.persons WHERE user_email = ?`;
                       
    try {
        // Execute the SQL query to fetch the user from the database
        const userData = await execute(selectQuery, [user_email]);

        // Check if a user with the provided email exists
        if (userData.length === 0) {
            throw new ApiError(404, "User not found");   
        }
        
        // Verify if the password matches                         
        const user = userData[0]; // Define user here
        if (user.password !== password) {
            throw new ApiError(401, "Incorrect password");
        }
        
        // Respond with success message 

     // Generate JWT token
    const token = jwt.sign({ user_email: user.user_email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });


    const response = new ApiResponse(200, { token }, "User authenticated successfully");
    res.send(response);
    } catch (error) {
        // Handle errors
        console.error("Error authenticating user:", error);
        throw new ApiError(500, "Failed to authenticate user");
    }  
});    






export default UserAuthentication;



