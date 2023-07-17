const Joi = require("joi");
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const Posts = new Io("src/database/posts.json");
const Views = new Io("src/database/views.json");
const Followers = new Io("src/database/followers.json");
const Follow = require("../models/Follow");

exports.follow = async (req, res) => {
  try {
    const users = await Users.read();
    const posts = await Posts.read();
    const views = await Views.read();
    const followers = await Followers.read();
    const verifiedUser = users.find((user) => user.id === req.verifiedUser);
    const { id } = req.params;
    ///////////// VALIDATION
    const schema = Joi.object({
      id: Joi.required(),
    });

    const { error } = schema.validate({ id });
    if (error) {
      return res.redirect("/");
    }
    ////////////////////////
    const subscribedAtPost = posts.find((post) => post.id === id);
    const findFollow = followers.find((follow) => follow.userWhoGotSubscribed === subscribedAtPost.user_id && follow.user_id === req.verifiedUser);
    const userWhoGotSubscribed = users.find((user) => user.id === subscribedAtPost.user_id);
    let data;
    if (findFollow) {
        data = followers.filter(
            (follow) => follow.user_id != req.verifiedUser || follow.userWhoGotSubscribed !== subscribedAtPost.user_id
        );
        const countOfFollowers = data.filter((follow) => follow.userWhoGotSubscribed === subscribedAtPost.user_id);
        const restOfUsers = users.filter((user) => user.id !== subscribedAtPost.user_id);
        users.forEach((user) => {
          if (user.id === subscribedAtPost.user_id) {
            user.followers = countOfFollowers.length;
            return [...restOfUsers, user];
          }
        });
        Users.write(users);
    } else {
        const newFollower = new Follow( req.verifiedUser, userWhoGotSubscribed.id );
        data = followers.length ? [...followers, newFollower] : [newFollower];
        const countOfFollowers = data.filter((follow) => follow.userWhoGotSubscribed === subscribedAtPost.user_id);
        const restOfUsers = users.filter((user) => user.id !== subscribedAtPost.user_id);
        users.forEach((user) => {
          if (user.id === subscribedAtPost.user_id) {
            user.followers = countOfFollowers.length;
            return [...restOfUsers, user];
          }
        });
        Users.write(users);
    }
    Followers.write(data);
    res.redirect(`/videos/exactVideo/${id}`);
  } catch (error) {
    console.log(error.message);
  }
};