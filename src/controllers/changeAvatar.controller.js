const { v4: uuid } = require("uuid");
const Joi = require("joi");
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const Posts = new Io("src/database/posts.json");

exports.changeAvatar = async (req, res) => {
  const users = await Users.read();
  const posts = await Posts.read();
  const { avatar } = req.files;
  //VALIDATION
  const schema = Joi.object({
    avatar: Joi.required(),
  });

  const { error } = schema.validate({ avatar });
  if (error) {
    return res.render("changeAvatar");
  }
  //Editing the avatar
  users.forEach((user) => {
    if (user.id === req.verifiedUser) {
      const personalPosts = posts.filter(post => post.user_id === user.id);
      let imageName = `${uuid()}.${avatar.mimetype.split("/")[1]}`;
      if (avatar.mimetype === "image/svg+xml") {
        //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
        imageName = `${uuid()}.svg`;
      }
      avatar.mv(`${process.cwd()}/uploads/${imageName}`);
      user.avatar = imageName;
      personalPosts.userAvatar = user.avatar;
    }
  });
  //Editing the Useravatar
  posts.forEach((post) => {
    if (post.user_id === req.verifiedUser) {
      let imageName = `${uuid()}.${avatar.mimetype.split("/")[1]}`;
      if (avatar.mimetype === "image/svg+xml") {
        //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
        imageName = `${uuid()}.svg`;
      }
      avatar.mv(`${process.cwd()}/uploads/${imageName}`);
      post.userAvatar = imageName;
    }
  });
  Users.write(users);
  Posts.write(posts);
  res.redirect("/");
};