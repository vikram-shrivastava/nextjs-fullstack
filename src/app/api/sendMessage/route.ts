import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import {Message} from '@/model/User.model'

export async function POST(request:Request){
    await dbConnect()
    const {username,content}=await request.json()
    try {
        const user=await UserModel.findOne({username})
        if(!user)
        {
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:400,
            })
        }
        if(!user.isAcceptingMessages)
        {
            return Response.json({
                success:false,
                message:"Messages are not Accepted"
            },{
                status:403,
            })
        }
        const newmessage={content,createdAt:new Date()}
        user.messages.push(newmessage as Message)
        await user.save()
        return Response.json({
            success:true,
            message:"Message Sent Successfully"
        },{
            status:200,
        })
    } catch (error) {
        console.error("An error occured while sending message",error)
        return Response.json({
            success:false,
            message:"Message cannot sent"
        },{
            status:500,
        })
    }
}