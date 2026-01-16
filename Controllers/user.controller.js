import { user } from "../Models/BlogModel/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { LogInSchema, RegisterSchema } from "../Zod/Auth.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
cloudinary.config({
  cloud_name: "dnwd3hnji",
  api_key: "234883445182685",
  api_secret: "-dTP6Uep99bN6n2uKUROnCRLv84",
});
// const storage = multer.diskStorage({
//   destination:(req,file,cb)=>{
//     cb(null,'uploads/')
//   },
//   filename:(req,file,cb)=>{
//     const suffix = Date.now();
//     cb(null,suffix + '-' + file.originalname);
//   }
// })

// const upload = multer({storage});
export const register = async (req, res) => {
  try {
    // console.log("hey");
    let url = null;
    if (req.files && req.files.photo) {
      const file = req.files.photo;
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "blog/users",
      });
      // console.log(uploadResult);

      url = uploadResult.secure_url;
    }

    const { name, email, password } = req.body;
    // const { data, error } = RegisterSchema.safeParse(req.body);
    // if (error) {
    //   // console.log(error.errors);
    //   return res.status(400).json({
    //     // msg: 'SignUp Failed',
    //     allErrors: JSON.parse(error.message),
    //     success: false,
    //   });
    // }

    const cur = await user.findOne({ email: email });
    if (cur) {
      return res.status(400).json({
        msg: "Email Already Exist",
        success: false,
      });
    }
    // const hashed = await bcrypt.hash(password,10);
    const newuser = await user.create({
      name,
      email,
      password,
      photo: url,
    });
    return res.status(201).json({
      msg: "user created Successfully",
      newuser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    const id = req.id;
    let url = null;
    // if (req.files && req.files.photo) {
    const file = req.files.photo;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "blog/users",
    });
    // console.log(uploadResult);

    url = uploadResult.secure_url;
    // }

    const curUser = await user.findById(id);
    console.log(curUser);
    if(!curUser){
      return res.status(400).json({
        msg: "Failed",
        success: false,
      });
    }
    curUser.photo = url;
    await curUser.save();
    return res.status(201).json({
      msg: "Photo Updated Successfully",
      curUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cur = await user.findOne({ email: email });
    // console.log(email);

    // console.log(password);
    const { data, error } = LogInSchema.safeParse({ email, password });
    if (error) {
      console.log("errors:", error.message);
      return res.status(400).json({
        msg: "Login Failed",
        allErrors: JSON.parse(error.message),
        success: false,
      });
    }
    if (!cur) {
      return res.status(400).json({
        msg: "Email Does Not exist",
        success: false,
      });
    }
    // console.log(cur);
    const curPassword = cur.password;
    // const ok = await bcrypt.compare(password,curPassword)
    if (curPassword != password) {
      return res.status(400).json({
        msg: "Wrong Password",
        success: false,
      });
    }
    const token_data = {
      userid: cur._id,
    };
    const day = 24 * 60 * 60 * 1000;
    const token = jwt.sign(token_data, process.env.SECRET_KEY);
    res.cookie("token", token, { maxAge: day });
    return res.status(201).json({
      msg: "User Logged in Successfully",
      cur,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getAllUser = async (req, res) => {
  try {
    const users = await user.find();
    return res.status(201).json({
      msg: "User Fetched Successfully",
      users,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const logout = async (req, res) => {
  try {
    const id = req.id;
    // console.log(id);

    const curUser = await user.findById(id);
    // console.log(curUser);
    res.cookie("token", "");
    return res.status(201).json({
      msg: "User Logged Out Successfully",
      curUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const delUser = async (req, res) => {
  try {
    const id = req.params.id;
    const curUser = await user.findByIdAndDelete(id);
    return res.status(201).json({
      msg: "User Deleted Successfully",
      curUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.id;
    const curUser = await user.findById(id);
    // console.log(curUser);

    return res.status(201).json({
      curUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getUserById = async (req, res) => {
  // console.log("hello");

  const id = req.params.id;
  const curUser = await user.findById(id);
  // console.log(curUser);
  try {
    return res.status(201).json({
      msg: "User fetched Successfully",
      curUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

