import {asyncHandler} from  "../utils/asyncHandler.js"; // import async handler class 
import {ApiError} from "../utils/ApiError.js";

import {User} from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js";

import  Jwt  from "jsonwebtoken";



//seperate method for generateaccessTokenandrefreshton
// to make this method we definitly pass the userId 

const generateAccessAndRefreshTokens =  async(userId)=>{
  try{
    //first we have to find the user 
   const user = await User.findById(userId)  
  const accessToken = user.generateAccessToken() //now generate accesstoken and hold in variable
  const refreshToken = user.generateRefreshToken()
   

  // now enter refreshtoken in db and save 

  user.refreshToken = refreshToken
 await  user.save({ validateBeforeSave : false})

 return {accessToken,refreshToken}


  }catch(error){
    throw new ApiError(500,"somethinng went wrong while generating refresh and access token " )  
  }
}


const registerUser = asyncHandler(async (req,res) =>{

    
    // res.status(200).json({
    //     message:"Successfully created"
    // })


   
  
     // check for images
     //upload them to cloudinary 
    
     // remove password and refress token field from response 
     // check for user creation 
       

     const {fullname ,email,username , password} = req.body   // get user detail from frontened
     console.log("email:",email);  
     

       //validation - not empty and
    //    if(fullname ===""){
    //     throw new ApiError(400,"fullname is required ")
    //    }
     
         // 2nd way to check 
         if(
            [fullname,email,username,password].some((field) =>
                field?.trim() === "" || field === null 
            )
         ){
           throw new ApiError(400,"All fields are required")
         }

      
  // check user is already exist 
 const existedUser = await User.findOne({
    $or: [{username},{email}]
  })
    if(existedUser){
        throw new ApiError(400,"User Already Exist")
    }

    //create user object - create entry in db
 const user = await  User.create({     
        fullname,email,password,username : username.toLowerCase()
    })
  const createdUser =  await User.findById(user._id).select(
    "-password -refreshToken") 

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user ")
    }
         

    //now return response
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
     
   
   
             
} )

  //login user  

const loginUser = asyncHandler(async (req,res) =>{
  // now take data from request body 

 const {email,username,password} = req.body
 if(!username && !email){
  throw new ApiError(400,"username or password is required")
 }


 

     


  //username or email 
  //find the user


  if(!user){
    throw new ApiError(404,"User doesnot exist")
  }





  //password check  


     // why we use user instead of User because User is the object of mongoDB which contain method like findone , updateone
     // but we make the instance of User i.e., user which contain the method like generateToken , accessToken , isPasswordCorrect

  
   const isPasswordValid = await user.isPasswordCorrect(password)
   
   if(!isPasswordValid){
    throw new ApiError(401,"Invalid User credentials")
   }




  //access and refreshtoken generate 

  // fpr this we made a saperate method fpr accesstoken and generate method which is 
  // present at line 12 in this file 

 const {accessToken ,refreshToken} = await generateAccessAndRefreshTokens(user._id)

  
  //send cookie
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly :true,  // when http true and secure true karte hai to sirf vo server se modified hoti hai 
    secure: true
  }

  return res.status(200).cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(
      200,{
        user :loggedInUser , accessToken , refreshToken
      }, "User logged In Successfully"
    )
  )

 
})

const logoutUser = asyncHandler(async (req,res) => { 


  // we have to reset the accesstoken and refreshtoken 
  //
 await User.findByIdAndUpdate(
    req.user._id ,{
      //mongodb operator which tells what things we want to update 
      $set:{
        refreshToken :undefined
      }, // return me new updated value milegi 
      new : true

    }
  )

  // we have to remove the cookie
  const options = {
    httpOnly :true,  // when http true and secure true karte hai to sirf vo server se modified hoti hai 
    secure: true
  }
  
  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged Out"))

})

                                 

const refreshAccessToken = asyncHandler(async (req,res) =>{


  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken   
  if(!incomingRefreshToken){
    throw new ApiError(401,"unauthorized request")
  }

    try{
      const decodedToken =jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET    
      )       
          
      const user = await User.findById(decodedToken?._id)    
    
      if(!user){
        throw new ApiError(401,"Invalid User Token ")
      }
    
      if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401,"Refresh token is expired or used")
      }
    
      const options = {
        httpOnly :true,
        secure :true
      }
    
    const {accessToken,newrefreshToken}= await  generateAccessAndRefreshTokens(user._id)
    
     return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken)        
     .json(
      new ApiResponse(200,{accessToken,refreshToken : newrefreshToken},"Access token refreshed")
     )      
    }catch(error){
    throw new ApiError(401,error?.message || "Invalid refresh token" )
    }
    
})

//update user controllers 
const changeCurrentPassword = asyncHandler(async(req,res)=>{
const {oldPassword,newPassword} = req.body


// const {oldPassword,newPassword,confirmPassword} = req.body

// if(!(newPassword === confirmPassword)){
//   //handle the condition if password and confirmpassword not equal
// }


const user = await User.findById(req.user?._id)
const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

if(!isPasswordCorrect){
  throw new ApiError(400,"Invalid old password")
}

user.password = newPassword
await  user.save({validateBeforeSave : false})   


   
return res.status(200).json(new ApiResponse(200,{},"Password change successfully"))

})


const getCurrentUser = asyncHandler(async(req,res)=>{
  return res.status(200).json(200,req.user,"current user fetched successfully")
})

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullname,email} = req.body
     if(!fullname || !email){
      throw new ApiError(400,"All fields are required")
     }


   const user =  User.findByIdAndUpdate(req.user?._id,{
    $set :{
      fullname ,email :email
    }
   },{new :true}).select("-password")

   return res.status(200).json(new ApiResponse(200,user,"Account Details updated successfully"))

})


// const updateUserAvatar = asyncHandler(async(req,res)=>{
//  const avatarLocalPath =  req.file?.path
//  if(!avatarLocalPath){
//   throw new ApiError(400,"Avatar file is missing")
//  }

//  const avatar  = await uploadOnCloudinary(avatarLocalPath)

//  if(!avatar.url){
//   throw new ApiError(400,"Error while uploading on avatar")
//  }

//  await User.findByIdAndUpdate(
//   req.user?._id,{
//     $set: {
//       avatar : avatar.url
//     }
//   }, {new : true}
//  ).select("-password")
   

// })

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails}

   
