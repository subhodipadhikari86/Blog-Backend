import mongoose from "mongoose"
const commentschema = new mongoose.Schema({
  text:{
    type:String
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  sentiment:{
    type:String
  },
  isHarmful:{
    type:Boolean,
    default:false
  }
},{timestamps:true})

export const comment = mongoose.model("comment",commentschema)