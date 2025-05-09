import mongoose from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URI!
if(!MONGODB_URL){
    throw new Error("Please provide mongodb url in env file")
}

// define mongoose type in types.d.ts
let cached = global.mongoose

// agar cached exist nahi karta toh banao
if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}


export async function dbConnection(){
    /** connection karte vaqt kya dhiyaan rakhna hai
     * cached  connection exist return cached conn
     * cached promise doesnot exist then create promise
     * create cached promise
     *  
     */
    
    
    if(cached.conn){
        console.log("connection already exist ")
        return cached.conn
    }
    if(!cached.promise){
        const options = {
            // buffercommands: true,
            maxPoolSize:2
        }

        cached.promise = mongoose.connect(MONGODB_URL,options).then(() => mongoose.connection)
        
    }

    try {
        cached.conn = await cached.promise
        
        console.log("connected to database successfully")
    } catch (error) {
        cached.promise = null;
        console.log("failed to connect to the database:", error)
        throw error
    }
    
    return cached.conn
}


