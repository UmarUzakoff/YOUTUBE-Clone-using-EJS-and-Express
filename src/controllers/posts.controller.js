const { v4: uuid } = require("uuid");
const Joi = require("joi");
const Io = require("../utils/Io");
const Users = new Io("src/database/users.json");
const Posts = new Io("src/database/posts.json");
const Post = require("../models/Post");
const Views = new Io("src/database/views.json");
const View = require("../models/View");
const Followers = new Io("src/database/followers.json");
const Likes = new Io("src/database/likes.json");
const Dislikes = new Io("src/database/dislikes.json");
const Dislike = require("../models/Dislike");

exports.exactVideo = async (req, res) => {
  try {
    const users = await Users.read();
    const posts = await Posts.read();
    const views = await Views.read();
    const followers = await Followers.read();
    const likes = await Likes.read();
    const dislikes = await Dislikes.read();
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
    const exactVideo = posts.find((post) => post.id === id);
    ///////////// VIEWS
    const findView = views.find((view) => view.post_id == id && view.user_id == req.verifiedUser);
    if (!findView) {
      const newView = new View(id, req.verifiedUser);
      const data = views.length ? [...views, newView] : [newView];
      Views.write(data);
      var viewsOfThisPost = views.filter((view) => view.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== id);
      posts.forEach((post) => {
        if (post.id === id) {
          post.views = viewsOfThisPost.length + 1;
          return [...restOfPosts, post];
        }
      });
      Posts.write(posts);
    }
    ///////////// FOLLOWERS
    const findFollow = followers.find((follow) => follow.userWhoGotSubscribed === exactVideo.user_id && follow.user_id === req.verifiedUser);
    const followText = findFollow ? "Subscribed" : "Subscribe";
    const ownerOfPost = users.find((user) => user.id === exactVideo.user_id);
    ///////////// LIKES
    const findLike = likes.find((like) => like.post_id === id && like.user_id === req.verifiedUser);
    const likeText = findLike ? "likeBor" : "likeYoq";
    ///////////// DISLIKES
    const findDislike = dislikes.find((dislike) => dislike.post_id === id && dislike.user_id === req.verifiedUser);
    const dislikeText = findDislike ? "dislikeBor" : "dislikeYoq";
    ///////////// RANDOM VIDEOS
    const shuffledPosts = posts.sort(() => 0.5 - Math.random());
    const randomPosts = shuffledPosts.splice(0, 10);
    /////////////
    res.render("exactVideo", {
      avatar: verifiedUser.avatar,
      username: verifiedUser.username,
      followers: ownerOfPost.followers,
      likes: exactVideo.likes,
      dislikes: exactVideo.dislikes,
      exactId: exactVideo.id,
      exactVideo: exactVideo.video,
      exactTitle: exactVideo.title,
      exactUsername: exactVideo.username,
      exactUserAvatar: exactVideo.userAvatar,
      exactViews: exactVideo.views,
      randomPosts,
      followText,
      likeText,
      dislikeText,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};

exports.postVideoPage = async (req, res) => {
  const users = await Users.read();
  const verifiedUser = users.find((user) => user.id === req.verifiedUser);
  res.render("postVideo", {
    avatar: verifiedUser.avatar,
    username: verifiedUser.username,
  });
};

exports.postVideo = async (req, res) => {
  try {
    const users = await Users.read();
    const posts = await Posts.read();
    const verifiedUser = users.find((user) => user.id === req.verifiedUser);
    const { video } = req.files;
    const { title } = req.body;
    //VALIDATION
    const schema = Joi.object({
      video: Joi.required(),
      title: Joi.string().required(),
    });

    const { error } = schema.validate({ video, title });
    if (error) {
      return res.render("postVideo");
    }
    //VIDEO
    let videoName = `${uuid()}.${video.mimetype.split("/")[1]}`;
    if (video.mimetype === "image/svg+xml") {
      //SVG fayllarning oxiri MIME type da svg+xml bilan tugar ekan, uni UIga chiqarish uchun image .svg bilan tugashi kerak, shuning uchun shunday qildim
      videoName = `${uuid()}.svg`;
    }
    video.mv(`${process.cwd()}/uploads/${videoName}`);
    /////
    const id = uuid();
    const userAvatar = verifiedUser.avatar;
    const username = verifiedUser.username;
    const postedDate = new Date();
    const user_id = verifiedUser.id;
    /////
    const newPost = new Post(
      id,
      videoName,
      userAvatar,
      title,
      username,
      postedDate,
      user_id
    );
    const data = posts.length ? [...posts, newPost] : [newPost];
    Posts.write(data);
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.render("postVideo", {
      error: error.message,
    });
  }
};

exports.personalPostsPage = async (req, res) => {
  const posts = await Posts.read();
  const personalPosts = posts.filter(
    (post) => post.user_id === req.verifiedUser
  );
  res.render("personalPosts", {
    personalPosts,
  });
};