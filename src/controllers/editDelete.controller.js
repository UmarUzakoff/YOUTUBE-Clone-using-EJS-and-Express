const Joi = require("joi");
const Io = require("../utils/Io");
const Posts = new Io("src/database/posts.json");
const Archive = new Io("src/database/archive.json");

exports.deletePost = async (req, res) => {
  try {
    const posts = await Posts.read();
    const archive = await Archive.read();
    const { id } = req.params;
    console.log(id);
    //VALIDATION
    const schema = Joi.object({
      id: Joi.required(),
    });

    const { error } = schema.validate({ id });
    if (error) {
      return res.redirect("/videos/personalPosts");
    }
    //Adding to archive the video which should be deleted
    const postForDeleting = posts.find((post) => post.id === id);
    const postForArchive = archive.length
      ? [...archive, postForDeleting]
      : [postForDeleting];
    Archive.write(postForArchive);
    //DELETE
    const restOfPosts = posts.filter((post) => post.id !== id);
    Posts.write(restOfPosts);
    res.redirect("/videos/personalPosts");
  } catch (error) {
    console.log(error.message);
    res.redirect("/videos/personalPosts");
  }
};

exports.deletePostForever = async (req, res) => {
  try {
    const archive = await Archive.read();
    const { id } = req.params;
    //VALIDATION
    const schema = Joi.object({
      id: Joi.required(),
    });

    const { error } = schema.validate({ id });
    if (error) {
      return res.redirect("/archive");
    }
    //DELETE FOREVER
    const restOfPostsInArchive = archive.filter((post) => post.id !== id);
    Archive.write(restOfPostsInArchive);
    res.redirect("/archive");
  } catch (error) {
    console.log(error.message);
    res.redirect("/archive");
  }
};

exports.postForEditing = async (req, res) => {
  const posts = await Posts.read();
  const personalPosts = posts.filter(
    (post) => post.user_id == req.verifiedUser
  );
  const { id } = req.params;
  const postForEditing = personalPosts.find((post) => post.id == id);
  res.render("editPost", {
    postForEditing,
  });
};

exports.editPost = async (req, res) => {
  try {
    const posts = await Posts.read();
    const { id,title } = req.body;
    //VALIDATION
    const schema = Joi.object({
      id: Joi.required(),
      title: Joi.string().required(),
    });

    const { error } = schema.validate({ id, title });
    if (error) {
      return res.render("editPost");
    }
    //EDIT
    const restOfPosts = posts.filter((post) => post.id !== id);
    posts.forEach((post) => {
      if (post.id === id) {
        post.title = title;
        return [...restOfPosts, post];
      }
    });
    Posts.write(posts);
    res.redirect("/videos/personalPosts");
  } catch (error) {
    console.log(error.message);
    res.redirect("/videos/personalPosts");
  }
};