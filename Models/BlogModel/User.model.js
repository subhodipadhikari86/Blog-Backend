
import mongoose, { mongo } from 'mongoose';
const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    chats:[
      {
        "userId":String,
        "Msges":[{
          flag:Number,
          text:String,
          date:String
        }]
      }
    ],
    photo:{
      type:String
    }
  },
  { timestamps: true }
);

export const user = mongoose.model('user', userschema);
