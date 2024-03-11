import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";


const videoSchema = new mongoose.Schema({
    videoFile : {
        type : String,  //cloudnary url
        required : true,
        
    },
    thumbnail :{
        type : String, //cloudnary url
        required : true,
        
    },

    title :{
        type : String,
        required : true,
        
    },

    
    description  : {
        type : String,
        required : true,
    },
     duration :{
        type : Number,
        required : true
     },
     views :{
        type : Number,    
        default : 0
     },

     isPublished :{
        type : Number,
        default : true
     },                          
             
    owner : [       
        {         
            type : Schema.Types.ObjectId,           
             ref : "User"                  
        }                                         
    ]      
        
       
},{timestamps : true})   
                        

            
//mongoose pipeline  and this code is to add mongoose plugin 
videoSchema.plugin(mongooseAggregatePaginate)
export const Video  = mongoose.model("Video",videoSchema)   