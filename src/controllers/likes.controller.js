const Joi = require("joi");
const Io = require("../utils/Io");
const Posts = new Io("src/database/posts.json");
const Likes = new Io("src/database/likes.json");
const Like = require("../models/Like");
const Dislikes = new Io("src/database/dislikes.json");
const Dislike = require("../models/Dislike");

exports.like = async (req, res) => {
  try {
    const posts = await Posts.read();
    const likes = await Likes.read();
    const dislikes = await Dislikes.read();
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
    const likedAtPost = posts.find((post) => post.id === id);
    const findLike = likes.find(
      (like) => like.post_id === id && like.user_id === req.verifiedUser
    );
    //FIND DISLIKE
    const findDislike = dislikes.find(
      (dislike) => dislike.post_id === id && dislike.user_id === req.verifiedUser
    );
    if (findDislike) {
      const deleteDislike = dislikes.filter(
        (dislike) => dislike.user_id !== req.verifiedUser || dislike.post_id !== id
      );
      const countOfDislikes = deleteDislike.filter((dislike) => dislike.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== likedAtPost.id);
      posts.forEach((post) => {
        if (post.id === likedAtPost.id) {
          post.dislikes = countOfDislikes.length;
          return [...restOfPosts, post];
        }
      });
      Dislikes.write(deleteDislike);
      Posts.write(posts);
    }
    ////////////////////////////////////////////////////////////////
    let data;
    if (findLike) {
      data = likes.filter(
        (like) => like.user_id !== req.verifiedUser || like.post_id !== id
      );
      const countOfLikes = data.filter((like) => like.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== likedAtPost.id);
      posts.forEach((post) => {
        if (post.id === likedAtPost.id) {
          post.likes = countOfLikes.length;
          return [...restOfPosts, post];
        }
      });
      Posts.write(posts);
    } else {
      const newLike = new Like(id, req.verifiedUser);
      data = likes.length ? [...likes, newLike] : [newLike];
      const countOfLikes = data.filter((like) => like.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== likedAtPost.id);
      posts.forEach((post) => {
        if (post.id === likedAtPost.id) {
          post.likes = countOfLikes.length;
          return [...restOfPosts, post];
        }
      });
      Posts.write(posts);
    }
    Likes.write(data);
    res.redirect(`/videos/exactVideo/${id}`);
  } catch (error) {
    console.log(error.message);
  }
};

exports.likedPosts = async (req, res) => {
  const posts = await Posts.read();
  const likes = await Likes.read();
  const likedPosts = likes.filter((like) => like.user_id === req.verifiedUser);
  const result = posts.filter(obj => likedPosts.some(post => post.post_id === obj.id));
  res.render("likedPosts", {
    result,
  });
};

exports.dislike = async (req, res) => {
  try {
    const posts = await Posts.read();
    const likes = await Likes.read();
    const dislikes = await Dislikes.read();
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
    //FIND DISLIKE and FINDLIKE
    const dislikedAtPost = posts.find((post) => post.id === id);
    const findLike = likes.find(
      (like) => like.post_id === id && like.user_id === req.verifiedUser
    );
    const findDislike = dislikes.find(
      (dislike) => dislike.post_id === id && dislike.user_id === req.verifiedUser
    );
    if (findLike) {
      const deleteLike = likes.filter(
        (like) => like.user_id !== req.verifiedUser || like.post_id !== id
      );
      const countOfLikes = deleteLike.filter((like) => like.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== dislikedAtPost.id);
      posts.forEach((post) => {
        if (post.id === dislikedAtPost.id) {
          post.likes = countOfLikes.length;
          return [...restOfPosts, post];
        }
      });
      Likes.write(deleteLike);
      Posts.write(posts);
    }

    ////////////////////////////////////////////////////////////////
    let data;
    if (findDislike) {
      data = dislikes.filter(
        (dislike) => dislike.user_id !== req.verifiedUser || dislike.post_id !== id
      );
      const countOfDislikes = data.filter((dislike) => dislike.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== dislikedAtPost.id);
      posts.forEach((post) => {
        if (post.id === dislikedAtPost.id) {
          post.dislikes = countOfDislikes.length;
          return [...restOfPosts, post];
        }
      });
      Posts.write(posts);
    } else {
      const newDislike = new Dislike(id, req.verifiedUser);
      data = dislikes.length ? [...dislikes, newDislike] : [newDislike];
      const countOfDislikes = data.filter((dislike) => dislike.post_id === id);
      const restOfPosts = posts.filter((post) => post.id !== dislikedAtPost.id);
      posts.forEach((post) => {
        if (post.id === dislikedAtPost.id) {
          post.dislikes = countOfDislikes.length;
          return [...restOfPosts, post];
        }
      });
      Posts.write(posts);
    }
    Dislikes.write(data);
    res.redirect(`/videos/exactVideo/${id}`);
  } catch (error) {
    console.log(error.message);
  }
};