import { z } from "zod";

export const MessageSchema = z.object({
    content: z.string().min(10, {message: "content must be atleast 10 character"}).max(300,{message: "message should not be more than 300 character"})

})