import express from "express"
import { delUser, getAllUser, getUser, getUserById, login, logout, register, updateProfilePhoto } from "../Controllers/user.controller.js";
import { isAuthenticated } from "../Middlewares/isAuthenticated.js";
import {getChatWithUser, sendChat } from "../Controllers/Chat.controller.js";
// import { chat } from "../Controllers/Chat.controller.js";
const router = express.Router();
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/getAllUser").get(getAllUser);
router.route("/logout").get(isAuthenticated,logout)
router.route("/delUserById/:id").get(delUser)
router.route("/getUser").get(isAuthenticated,getUser)
router.route("/getUserById/:id").get(isAuthenticated,getUserById)
router.route("/sendMsz").post(isAuthenticated,sendChat);
router.route("/getMsz/:id").get(isAuthenticated,getChatWithUser);
router.route("/updateProfilePhoto").post(isAuthenticated,updateProfilePhoto)
export default router