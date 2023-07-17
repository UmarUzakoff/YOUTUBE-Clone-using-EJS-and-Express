const { Router } = require("express");
const { exactVideo, postVideoPage, postVideo, personalPostsPage } = require("../controllers/posts.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.get("/videos/exactVideo/:id", exactVideo);
router.get("/videos/postVideo", postVideoPage);
router.post("/videos/postVideo", postVideo);
router.get("/videos/personalPosts", personalPostsPage);

module.exports = router;