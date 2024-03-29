// const asyncHandler =() =>{}

  
export {asyncHandler}


  
   
// const asyncHandler =() =>{}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

const asyncHandler = (fn) => async (req,res,next) => {
    try{

     await fn(req,res,next)
    }
    catch(error){
        res.status(error.code || 500).json({
            success : error.message
        })
    }
}
