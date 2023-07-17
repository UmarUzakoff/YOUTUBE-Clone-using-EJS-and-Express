const { Router } = require("express");
const { home, logout, changeAvatarPage, archive } = require("../controllers/home.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.get("/", home);
router.get("/changeAvatar", changeAvatarPage);
router.get("/archive", archive);
router.get("/logout", logout);

module.exports = router;