import mongoose from "mongoose";
const connectDB = async () =>{
    try {
        await mongoose.connect("mongodb+srv://subhodipadhikari88:potzoF2cLdn4pGtK@cluster1.hcmto9l.mongodb.net/");
        console.log(`mogodb connected successfully`);
        
    } catch (error) {
        console.log(error);
        
    }
}
export default connectDB