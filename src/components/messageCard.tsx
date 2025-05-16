import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { Message } from "@/models/User"
import { ApiResponse } from "@/types/ApiResponse"

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    console.log("messageCard message:",message.content)

    

    const handleDeleteConfirm = async() => {
        const response =await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.message(response.data.message)
        onMessageDelete(message._id)
        }
    return (
        <Card>
            <CardHeader>
                {/* <CardTitle>Card Title</CardTitle> */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive' className="w-5 h-5  "><X/></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
               
            </CardHeader>
            <CardContent>
              {message.content}
            </CardContent>
        </Card>
    )
}

export default MessageCard