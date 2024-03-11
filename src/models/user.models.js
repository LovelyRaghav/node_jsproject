import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase :true,
        trim:true,
        index : true
    },
    email :{
        type : String,
        required : true,
        unique : true,
        lowercase :true,   
        trim:true
    },
    
    
    fullname :{
        type : String,
        required : true,
        index : true,
        trim:true,
    },

    // avatar : {
    //     type : String, //cloudnary url
    //     required : true,  
    // },
     coverImage :{
        type : String, //cloudnary url
     },
      
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
             ref : "Video"
        }
    ],
    password :{
        type : String,
        required :[true ,'Password is required']
    },

    refreshToken :{
        type : String
    }
        
    
},{timestamps : true})            





// we add pre hook to encrypt the data before saving data 
userSchema.pre("save",async function (next) {
    // now when ever we save the password first it encrypt and then save 
    // and apply if condition for if we change password then only encrypt 
    if(this.isModified("password")) {    //check password is modified or not  
        this.password = await bcrypt.hash(this.password,10)
        next()
    }        return next()  // else return next means dont go in if part 
    
})   


// now check the password is correct 
userSchema.methods.isPasswordCorrect  = async function (password) {
    // logic to check the password is correct 
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
return jwt.sign({                                     
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname
},         
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn : process.env.ACCESS_TOKEN_EXPIRY
}    
)          
          
}      
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,{
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
    )

}



export const User  = mongoose.model("User",userSchema)