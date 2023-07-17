const { Router } = require("express");
const { changeAvatar } = require("../controllers/changeAvatar.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.post("/changeAvatar", changeAvatar);

module.exports = router;