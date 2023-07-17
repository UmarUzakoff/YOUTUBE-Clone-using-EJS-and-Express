const { Router } = require("express");
const { like, likedPosts, dislike } = require("../controllers/likes.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.post("/videos/likes/:id", like);
router.get("/videos/likedVideos", likedPosts);
router.post("/videos/dislikes/:id", dislike);


module.exports = router;