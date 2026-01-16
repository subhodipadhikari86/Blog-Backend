import { user } from "../Models/BlogModel/User.model.js";

export const sendChat = async (req, res) => {
  try {
    const curUserId = req.id;
    const { text, userid } = req.body;
    console.log(text);
    
    const sUser = await user.findById(curUserId);
    const rUser = await user.findById(userid);
    const allChat = sUser.chats;
    const otherChat = rUser.chats
    let ind = -1;
    ind = allChat.findIndex((item) => {
      return item.userId === userid;
    });
    if (ind != -1) {
      allChat[ind].Msges.push({
        flag: 0,
        text: text,
        date: new Date().toLocaleTimeString(),
      });
      otherChat[ind].Msges.push({
        flag: 1,
        text: text,
        date: new Date().toLocaleTimeString(),
      });
      await sUser.save();
      await rUser.save();
    } else {
      sUser.chats.push({
        userId: userid,
        Msges: [
          {
            flag: 0,
            text: text,
            date: new Date().toLocaleTimeString(),
          },
        ],
      });
      rUser.chats.push({
        userId: curUserId,
        Msges: [
          {
            flag: 1,
            text: text,
            date: new Date().toLocaleTimeString(),
          },
        ],
      });
    }
    await sUser.save();
    await rUser.save();

    return res.status(201).json({
      msg: "chat sent Successfully",
      chats: sUser.chats,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getChatWithUser = async (req, res) => {
  try {
    const curUserId = req.id;
    const endUserId = req.params.id;
    const sUser = await user.findById(curUserId);
    const rUser = await user.findById(endUserId);
    // console.log(sUser);
    // console.log(sUser.chats);
    // sUser.chats = [];
    // sUser.save();
    // rUser.chats = [];

    const allChat = sUser.chats;
    let chatWithUser = allChat.find((item) => {
      return item.userId === endUserId;
    });
    if(!chatWithUser)chatWithUser = []
    return res.status(201).json({
      msg: "All msges with user fetched",
      chatss: chatWithUser,
      success: true,
    });
  } catch (e) {
    console.log(e);
  }
};