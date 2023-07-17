const { Router } = require("express");
const { follow } = require("../controllers/follow.controller");
const { tokenMiddleware } = require("../middlewares/token.middleware");

const router = Router();

router.use(tokenMiddleware);

router.post("/users/subscribe/:id", follow );

module.exports = router;