import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const  verifyJwt = asyncHandler(async(req,_,next)=>{
try {
    
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","") || "";

    
            console.log(token)
            if(!token){
                throw new ApiError(200,"Unauthorized request")
            }


          const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
        console.log(decodedToken)


            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
            if(!user){
                throw new ApiError(401,"Invalid access token")
            }
    
            req.user = user;
            next()
} catch (error) {
    throw new ApiError(401,error?.message || "invalid access Token")
}
 })