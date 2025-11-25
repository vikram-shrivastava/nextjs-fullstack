import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request) {
    await dbConnect()
    const session =await getServerSession(authOption)
    const user:User=session?.user as User
    if(!session || !user)
    {
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{
            status:401
        })
    }
    const userId=new mongoose.Types.ObjectId(user._id);
    try {
       const user=await UserModel.aggregate([
        { $match:{_id:userId} },
        { $unwind:'$messages'},
        { $sort:{'messages.createdAt':-1} },
        { $group:{_id:"$_id",messages:{$push:'$messages'}} }
       ]) 
       if(!user)
       {
            return Response.json({
                success:false,
                message:"Messages cannot be fetched"
            },{
                status:502
            })
       }
       else if(user.length===0)
       {
            return Response.json({
                success:false,
                message:"User not accepting messages"
            },{
                status:200
            })
       }
       return Response.json({
        success:true,
        messages:user[0].messages
    },{
        status:200
    })
    } catch (error) {
        console.error("Cannot get messages")
        return Response.json({
            success:false,
            message:"Cannot get messages"
        })
    }
}