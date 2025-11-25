import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request:Request){
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
    const userId=user._id
    const {acceptMessages}=await request.json()
    try {
        const updatedUser=await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages:acceptMessages},
            
        )
        const value=await UserModel.findById(userId)
        if(!updatedUser)
        {
            return Response.json({
                success:false,
                message:"Cannot update user"
            },{
                status:401
            })
        }
        else{
            return Response.json({
                success:true,
                message:"User updated successfully"
            },{
                status:200
            })
        }
    } catch (error) {
        console.error("Error in Authentication",error)
        return Response.json({
            success:false,
            message:"Error in Authentication"
        })
    }
}

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
    const userId=user._id
    try {
        const currUser=await UserModel.findById(userId)
        if(!currUser)
        {
            return Response.json({
                success:false,
                message:"User not found"
            })
        }
        else{
            return Response.json({
                success:true,
                isAcceptingMessage:currUser.isAcceptingMessages,
                message:"User found",
            })
        }
    } catch (error) {
        console.log("Error in getting message accepting status")
        return Response.json({
            success:false,
            message:"Error in getting message accepting status"
        },{
            status:500
        })
    }
}