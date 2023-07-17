const auth = require("./auth.routes");
const home = require("./home.routes");
const changeAvatar = require("./changeAvatar.routes");
const videos = require("./posts.routes");
const editDelete = require("./editDelete.routes");
const follow = require("./follow.routes");
const likes = require("./likes.routes");

module.exports = [auth, home, changeAvatar, videos, editDelete, follow, likes];