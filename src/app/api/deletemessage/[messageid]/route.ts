import { getServerSession } from "next-auth";
import { authOption } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function DELETE(request:Request,{params}:{params:{messageid:string}}) {
    const messageId=params.messageid;
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
    try {
        const updatedresult=await UserModel.updateOne(
            {_id:user._id},
            {$pull:{messages:{_id:messageId}}}
        )
        if(updatedresult.modifiedCount>0)
        {
            return Response.json({
                success:true,
                message:"Message Deleted Successfully"
            },
            {
                status:200
            })
        }
        else if(updatedresult.modifiedCount==0)
        {
            return Response.json({
                success:false,
                message:"Message not found or already deleted"
            },
            {
                status:402
            })
        }
    } catch (error) {
        console.error("Cannot delete messages")
        return Response.json({
            success:false,
            message:"Cannot delete messages"
        },
        {
            status:502
        })
    }
}