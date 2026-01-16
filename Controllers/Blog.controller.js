import { aiRecom, getSentiment } from "../AI.js";
import { blog } from "../Models/BlogModel/Blog.model.js";
import { comment } from "../Models/BlogModel/comment.model.js";
import { user } from "../Models/BlogModel/User.model.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
cloudinary.config({
  cloud_name: "dnwd3hnji",
  api_key: "234883445182685",
  api_secret: "-dTP6Uep99bN6n2uKUROnCRLv84",
});
export const createBlog = async (req, res) => {
  try {
    let url = null;
    if (req.files && req.files.photo) {
      const file = req.files.photo;
      const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "blog/blogPhoto",
      });
      // console.log(uploadResult);
      url = uploadResult.secure_url;
    }
    const { category, title, content } = req.body;
    if (!category || !title || !content) {
      return res.status(400).json({
        msg: "something is missing",
        success: false,
      });
    }
    const newBlog = await blog.create({
      category,
      title,
      content,
      createdBy: req.id,
      photo: url,
    });
    return res.status(201).json({
      msg: "Blog Successfully Created",
      newBlog,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};
export const postComment = async (req, res) => {
  try {
    const { cmnt, blogId } = req.body;
    const UserId = req.id;
    const curBlog = await blog.findById(blogId);
    const contentBlog = curBlog.content;
    const prompt = cmnt;
    const content = contentBlog;
    const aiResponse = await getSentiment({ prompt, content });
    if (aiResponse.text.isHarmful) {
      return res.status(400).json({
        msg: "You Are Trying To Post Abbusive Comment",
        success: false,
      });
    }
    // console.log(aiResponse.text);

    const curCmnt = await comment.create({
      text: cmnt,
      author: UserId,
      sentiment: aiResponse.text.sentiment,
      isHarmful: aiResponse.text.isHarmful,
    });
    console.log(blogId);

    const curCmntId = curCmnt._id;
    curBlog.comments.push(curCmntId);
    await curBlog.save();
    const nowblog = await curBlog.populate("comments");
    return res.status(201).json({
      msg: "Comment created successfully",
      curCmnt,
      nowblog,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blog.find().populate("createdBy");
    return res.status(201).json({
      msg: "All Blogs Fetched Successfully",
      blogs,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const id = req.params.id;
    const curBlog = await blog
      .findById(id)
      .populate("createdBy")
      .populate({
        path: "comments",
        populate: {
          path: "author",
        },
      });
    return res.status(201).json({
      msg: "Blog Fetchedd Successfully",
      curBlog,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteBlogById = async (req, res) => {
  const blogId = req.params.id;
  const deletedBlog = await blog.findByIdAndDelete(blogId);
  if (!deletedBlog) {
    return res.status(400).json({
      msg: "Blog Not Found",
      success: false,
    });
  }
  return res.status(201).json({
    msg: "Blog Deleted Successfully",
    deletedBlog,
    success: true,
  });
};

export const delAllBlog = async (req, res) => {
  try {
    const userid = req.id;
  } catch (e) {
    console.log(e);
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const id = req.id;
    const userBlogs = await blog.find({ createdBy: id }).populate("createdBy");
    if (!userBlogs) {
      return res.status(404).json({
        msg: "Blogs Not Found",
        success: false,
      });
    }
    return res.status(201).json({
      msg: "Blogs fetched Successfully",
      userBlogs,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const delBlogByUser = async (req, res) => {};

// export const getCommentsByUser = async(req,res)=>{
//   try{
//     const userid = req.id;
//     const allComments = comment.find({author:userid})
//     return res.status(201).json({
//       msg:"all comment fetched successfully",
//       allComments,
//       success:true
//     })
//   }
//   catch(e){
//     console.log(e);

//   }
// }

export const deleteCommentById = async (req, res) => {
  try {
    const cmntId = req.params.id;
    // console.log(cmntId);

    const deleted = await comment.findByIdAndDelete(cmntId);
    return res.status(201).json({
      msg: "Comment Deleted Successfully",
      // deleted,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getCommentsByBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const curBlog = await blog.findById(blogId);
    const temp = (
      await curBlog.populate({
        path: "comments",
        populate: {
          path: "author",
        },
      })
    ).comments;
    return res.status(201).json({
      msg: "Comments fetched Successfully",
      temp,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getRecom = async (req, res) => {
  const allBlogs = await blog.find();
  const arr = [];
  const { prompt } = req.body;
  console.log("prompt is",prompt)
  allBlogs.forEach((val, ind) => {
    const title = val.title;
    const content = val.content;
    const id = val._id;
    arr.push({
      title: title,
      content: content,
      id: id,
    });
  });
  let response = await aiRecom({ prompt, arr });
  let txt = response.text;
  let mainArr = await Promise.all(
    txt.map(async (val) => {
      return await blog.findById(val.id).populate("createdBy");
    })
  );

  return res.status(201).json({
    mainArr,
  });
};
