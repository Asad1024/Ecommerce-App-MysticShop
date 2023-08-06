import jwt from "jsonwebtoken"
import asyncHandler from "./asyncHandler.js"
import User from "../models/userModels.js"

const protect = asyncHandler( async (req, res, next) => {
    let token

    token = req.cookies.jwt

    if(token){
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decode.userId).select("-password")
            next()
        } catch (error) {
            console.log(error);
            res.status(401)
        throw new Error("Not authorizes, token failed")
        }
    }else{
        res.status(401)
        throw new Error("Not authorizes, no token")
    }
}) 


const admin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error("Not authorized as admin")
    }
}

export {protect, admin}