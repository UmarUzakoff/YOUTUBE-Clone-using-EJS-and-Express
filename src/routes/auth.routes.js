const { Router } = require("express");
const { login, register } = require("../controllers/auth.controller");

const router = Router();

router.get("/auth/login", (req,res) => {
  res.render("login");
});

router.get("/auth/register", (req, res) => {
  res.render("register");
});

router.post("/auth/login", login);
router.post("/auth/register", register );

module.exports = router;