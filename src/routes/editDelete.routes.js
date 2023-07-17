const { Router } = require("express");
const { deletePost, deletePostForever, postForEditing, editPost } = require("../controllers/editDelete.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.get("/videos/delete/:id", deletePost);
router.get("/archive/deleteForever/:id", deletePostForever);
router.get("/videos/edit/:id", postForEditing);
router.post("/videos/edit", editPost);

module.exports = router;