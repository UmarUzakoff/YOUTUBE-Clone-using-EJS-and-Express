const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const Posts = new Io("src/database/posts.json");
const Archive = new Io("src/database/archive.json");

exports.home = async (req, res) => {
  const users = await Users.read();
  const posts = await Posts.read();
  const verifiedUser = users.find((user) => user.id === req.verifiedUser);
  //RANDOM VIDEOS
  const shuffledPosts = posts.sort(() => 0.5 - Math.random());
  const randomPosts = shuffledPosts.splice(0, 20);
  res.render("index", {
    randomPosts,
    avatar: verifiedUser.avatar,
    username: verifiedUser.username
  });
};

exports.changeAvatarPage = async (req, res) => {
  const users = await Users.read();
  const verifiedUser = users.find((user) => user.id === req.verifiedUser);
  res.render("changeAvatar", {
    avatar: verifiedUser.avatar,
    username: verifiedUser.username,
  });
};

exports.archive = async (req, res) => {
  const users = await Users.read();
  const archive = await Archive.read();
  const archiveForExactUser = archive.filter(post => post.user_id === req.verifiedUser)
  const verifiedUser = users.find((user) => user.id === req.verifiedUser);
  res.render("archive", {
    archiveForExactUser,
    avatar: verifiedUser.avatar,
    username: verifiedUser.username,
  });
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};